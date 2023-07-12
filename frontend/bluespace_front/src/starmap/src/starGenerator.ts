import { Planet } from "./planet";
import { PlanetsDataLoader } from "./planetsDataLoader";

class StarGenerator {

    // 星球生成相关
    private static readonly COMMON_SPEED: number = 0.01

    // 旋臂分布相关
    private static readonly NORMAL_DIST_VARIANCE = 70
    private static readonly SPIRAL_SIZE = 100
    private static readonly SPIRAL_L = 0.5 * Math.PI
    private static readonly SPIRAL_R = 2.5 * Math.PI

    /**
     * 随机一个[L, R]的实数
     */
    private static randomRange(L: number, R: number) {
        return Math.random() * (R - L) + L
    }

    /**
     * 随机一个二维符合正态分布的坐标
     */
    private static randomNormalDist(mean: number, variance: number): {x: number, y: number} {
        let u1 = 1 - Math.random(); // (0, 1]
        let u2 = 1 - Math.random();
        u1 = Math.sqrt(-2.0 * Math.log(u1))
        u2 = 2.0 * Math.PI * u2
        let z1 = u1 * Math.cos(u2); // random normal (0, 1)
        let z2 = u1 * Math.sin(u2);
        return {
            x: z1 * variance + mean,
            y: z2 * variance + mean,
        }
    }


    /**
     * 根据angle, u, a, b生成一个等角螺线上的一个随机点（无正态分布)
     */
    private static equaiangularSpiral(angle: number, u: number, a: number, b: number): {x: number, y: number} {
        const f = a * Math.pow(Math.E, b * u)
        return {
            x: f * Math.cos(u + angle),
            y: f * Math.sin(u + angle),
        }
    }

    /**
     * 在银河系4条旋臂的基础上，随机出n个位置
     */
    static async randomGalaxyStar(num: number): Promise<Array<Planet>> {
        const L = StarGenerator.SPIRAL_L
        const R = StarGenerator.SPIRAL_R
        const deltaSpiral = Math.floor(num / 4)
        const deltaStar = (R - L) / deltaSpiral

        await PlanetsDataLoader.getInstance().setup()
        console.log(PlanetsDataLoader.getInstance().length())
        console.log(PlanetsDataLoader.getInstance().query(1))
        
        let planets = new Array(num)
        let idx = 0;
        let loaderIdx = 0;

        planets[idx] = Planet.createPlanet(
            {x:0, y:0, z:0},
            {x:0, y:0, z:0},
            {x:0, y:0, z:0},
            Planet.STAR_SHADER_TYPE_BLACKHOLE,
            Planet.PLANET_TEXTURE_MARS,
            loaderIdx,
        )
        loaderIdx = (loaderIdx + 1) % PlanetsDataLoader.getInstance().length()
        idx++

        planets[idx] = Planet.createPlanet(
            {x:0, y:0, z:0},
            {x:0, y:0, z:0},
            {x:0, y:0, z:0},
            Planet.STAR_SHADER_TYPE_PLANET,
            Planet.PLANET_TEXTURE_EARTH,
            -1,
        )
        idx++

        for(let i = 0; i <= 3; i++) { // 枚举每条旋臂
            let t = L
            const angle = i * Math.PI / 2.0
            for(let j = 0; (i != 3 && j < deltaSpiral) || (i == 3 && idx < num); j++, idx++, t += deltaStar) { // 枚举旋臂上的每个位置
                
                const origin = StarGenerator.equaiangularSpiral(angle, t, StarGenerator.SPIRAL_SIZE, 0.4)
                const delta = {
                    x: StarGenerator.randomNormalDist(0, StarGenerator.NORMAL_DIST_VARIANCE).x,
                    y: StarGenerator.randomNormalDist(0, StarGenerator.NORMAL_DIST_VARIANCE).x,
                    z: StarGenerator.randomNormalDist(0, StarGenerator.NORMAL_DIST_VARIANCE).x,
                }

                let position = {
                    x: origin.x + delta.x,
                    y: 0        + delta.y,
                    z: origin.y + delta.z,
                }

                let type = StarGenerator.randomRange(0, 1)

                planets[idx] = Planet.createPlanet(
                    position, {
                        x: StarGenerator.randomRange(-3.14, 3.14),
                        y: StarGenerator.randomRange(-3.14, 3.14),
                        z: StarGenerator.randomRange(-3.14, 3.14),
                    }, {
                        x: StarGenerator.randomRange(-1.0, 1.0) * StarGenerator.COMMON_SPEED,
                        y: StarGenerator.randomRange(-1.0, 1.0) * StarGenerator.COMMON_SPEED,
                        z: StarGenerator.randomRange(-1.0, 1.0) * StarGenerator.COMMON_SPEED,
                    },
                    (type <= 0.002) ? (Planet.STAR_SHADER_TYPE_O) :
                    (type <= 0.004) ? (Planet.STAR_SHADER_TYPE_B) :
                    (type <= 0.012) ? (Planet.STAR_SHADER_TYPE_A) :
                    (type <= 0.060) ? (Planet.STAR_SHADER_TYPE_F) :
                    (type <= 0.143) ? (Planet.STAR_SHADER_TYPE_G) :
                    (type <= 0.242) ? (Planet.STAR_SHADER_TYPE_K) :
                    (Planet.STAR_SHADER_TYPE_M),
                    Math.floor(Math.random() * (Planet.PLANET_TEXTURE_MAX + 1)),
                    loaderIdx,
                )
                loaderIdx = (loaderIdx + 1) % PlanetsDataLoader.getInstance().length()
            }
        }

        return planets
    }

    /**
     * 在银河系4条旋臂的基础上，随机出n个位置
     * 
     * 星球数据根据真实数据生成
     */
    static async trueRandomGalaxyStar(num: number): Promise<Array<Planet>> {
        const L = StarGenerator.SPIRAL_L
        const R = StarGenerator.SPIRAL_R
        const deltaSpiral = Math.floor(num / 4)
        const deltaStar = (R - L) / deltaSpiral

        await PlanetsDataLoader.getInstance().setup()
        console.log(PlanetsDataLoader.getInstance().length())
        console.log(PlanetsDataLoader.getInstance().query(1))
        
        let planets = new Array(num)
        let idx = 0;
        let loaderIdx = 0;

        planets[idx] = Planet.createPlanet(
            {x:0, y:0, z:0},
            {x:0, y:0, z:0},
            {x:0, y:0, z:0},
            Planet.STAR_SHADER_TYPE_BLACKHOLE,
            Planet.PLANET_TEXTURE_MARS,
            loaderIdx,
        )
        loaderIdx = (loaderIdx + 1) % PlanetsDataLoader.getInstance().length()
        idx++

        planets[idx] = Planet.createPlanet(
            {x:0, y:0, z:0},
            {x:0, y:0, z:0},
            {x:0, y:0, z:0},
            Planet.STAR_SHADER_TYPE_PLANET,
            Planet.PLANET_TEXTURE_EARTH,
            -1,
        )
        idx++

        for(let i = 0; i <= 3; i++) { // 枚举每条旋臂
            let t = L
            const angle = i * Math.PI / 2.0
            for(let j = 0; (i != 3 && j < deltaSpiral) || (i == 3 && idx < num); j++, idx++, t += deltaStar) { // 枚举旋臂上的每个位置
                
                const origin = StarGenerator.equaiangularSpiral(angle, t, StarGenerator.SPIRAL_SIZE, 0.4)
                const delta = {
                    x: StarGenerator.randomNormalDist(0, StarGenerator.NORMAL_DIST_VARIANCE).x,
                    y: StarGenerator.randomNormalDist(0, StarGenerator.NORMAL_DIST_VARIANCE).x,
                    z: StarGenerator.randomNormalDist(0, StarGenerator.NORMAL_DIST_VARIANCE).x,
                }

                let position = {
                    x: origin.x + delta.x,
                    y: 0        + delta.y,
                    z: origin.y + delta.z,
                }

                let type = StarGenerator.randomRange(0, 1)

                planets[idx] = Planet.createPlanet(
                    position, {
                        x: StarGenerator.randomRange(-3.14, 3.14),
                        y: StarGenerator.randomRange(-3.14, 3.14),
                        z: StarGenerator.randomRange(-3.14, 3.14),
                    }, {
                        x: StarGenerator.randomRange(-1.0, 1.0) * StarGenerator.COMMON_SPEED,
                        y: StarGenerator.randomRange(-1.0, 1.0) * StarGenerator.COMMON_SPEED,
                        z: StarGenerator.randomRange(-1.0, 1.0) * StarGenerator.COMMON_SPEED,
                    },
                    (type <= 0.002) ? (Planet.STAR_SHADER_TYPE_O) :
                    (type <= 0.004) ? (Planet.STAR_SHADER_TYPE_B) :
                    (type <= 0.012) ? (Planet.STAR_SHADER_TYPE_A) :
                    (type <= 0.060) ? (Planet.STAR_SHADER_TYPE_F) :
                    (type <= 0.143) ? (Planet.STAR_SHADER_TYPE_G) :
                    (type <= 0.242) ? (Planet.STAR_SHADER_TYPE_K) :
                    (Planet.STAR_SHADER_TYPE_M),
                    Math.floor(Math.random() * (Planet.PLANET_TEXTURE_MAX + 1)),
                    loaderIdx,
                )
                loaderIdx = (loaderIdx + 1) % PlanetsDataLoader.getInstance().length()
            }
        }

        return planets
    }
}

export { StarGenerator }
