# Blue Space Renderer

> Made by YXH_XianYu

## 1. Introduction


## 2. Star Classification

### 2.1 Stellar Classification

| 编号 | 类型 | 颜色   | 主序星半径    | 占比      |
| ---- | ---- | ------ | ------------- | --------- |
| 1    | O    | 蓝色   | >= 6.6R       | ~0.00003% |
| 2    | B    | 蓝白色 | 1.8 ~ 6.6 R   | 0.13%     |
| 3    | A    | 白色   | 1.4 ~ 1.8 R   | 0.6%      |
| 4    | F    | 黄白色 | 1.15 ~ 1.4 R  | 3%        |
| 5    | G    | 黄色   | 0.96 ~ 1.15 R | 7.6%      |
| 6    | K    | 淡橙色 | 0.7 ~ 0.96 R  | 12.1%     |
| 7    | M    | 橙红色 | <= 0.7 R      | 76.45%    |

## 3. About Shader

### 3.1 Shader Pass

* Planet -> `texture[0]`
* `texture[0]` -> Composite1 -> `texture[1]`
* `texture[1]` -> Composite2 -> `texture[2]`
* `texture[0]` + `texture[2]` -> Final -> `context.texture`

### 3.2 Uniform Variables

#### 3.2.1 EnvironmentArray

* f32
* 0: Canvas Width
* 1: Canvas Height
* 2: Camera Position X
* 3: Camera Position Y
* 4: Camera Position Z
* 5: 
