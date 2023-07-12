# Summer Project



#### 1. 登录

* /api/login
* 前端to后端
  * username：用户名
  * password：密码
* 后端to前端
  * state：状态
  * error_message：错误原因
  * token

#### 2.申请注册

* /api/send
* 前端to后端
  * username：用户名
  * email：邮箱
* 后端to前端
  * state：状态
  * error_message：错误原因

#### 3. 注册

* /api/register
* 前端to后端
  * username：用户名
  * email：邮箱
  * password：密码
  * vertification_code：验证码
* 后端to前端
  * state：状态
  * error_message：错误原因

#### 4. 用户保存头像

* /api/avatar
* 前端to后端
  * token
  * avatar：头像string字符串
* 后端to前端
  * state：状态
  * error_message：错误原因

#### 5. 修改用户名

* /api/modify/username
* 前端to后端
  * token
  * new_username：新的用户名
* 后端to前端
  * state：状态
  * error_message：错误原因

#### 6. 修改密码

* /api/modify/password
* 前端to后端
  * token
  * old_password：旧密码
  * new_password：新密码
* 后端to前端
  * state：状态
  * error_message：错误原因

#### 7. 从数据库获取所有行星数据

* /api/resource
* 前端to后端
  * token
* 后端to前端
  * 一个JSON数组planets
    * id：行星的id，要求互不相同
    * name：行星的名称
    * features：行星7个维度的特征（Orbit_period，Semi_major_axis，Mass，Radius，Stellar_luminosity，Stellar_mass，Stellar_radius）
    * esi：行星与地球的相似度
    * habitable：是否宜居（true or false）

#### 8. 用户收藏已有的某个星球

* /api/collect
* 前端to后端
  * token
  * id：行星id
* 后端to前端
  * state：状态
  * error_message：错误原因

#### 9. 预测

* /api/predict
* 前端to后端
  * token
  * features：行星7个维度的特征（Orbit_period，Semi_major_axis，Mass，Radius，Stellar_luminosity，Stellar_mass，Stellar_radius）
* 后端to前端
  * esi：行星与地球的相似度
  * habitable：是否宜居（true or false）
  * 其它需要可视化的数据（暂不确定，需要fjq和zsy确定，一个思路是可以和其它的已有宜居星球或不宜居星球数据作对比（折线图、柱状图））

#### 10.  保存某个预测的星球数据

* /api/save
* 前端to后端
  * token
  * features：行星7个维度的特征（Orbit_period，Semi_major_axis，Mass，Radius，Stellar_luminosity，Stellar_mass，Stellar_radius）
  * esi：行星与地球的相似度
  * habitable：是否宜居（true or false）
* 后端to前端
  * state：状态
  * error_message：错误原因

#### 11. 用户查看收藏的星球

* /api/view/like
* 前端to后端
  * token
* 后端to前端
  * id：行星id（互不相同）
  * features：行星7个维度的特征（Orbit_period，Semi_major_axis，Mass，Radius，Stellar_luminosity，Stellar_mass，Stellar_radius）
  * esi：行星与地球的相似度
  * habitable：是否宜居（true or false）

#### 12. 用户查看保存的星球

* /api/view/save
* 前端to后端
  * token
* 后端to前端
  * id：行星id（互不相同）
  * features：行星7个维度的特征（Orbit_period，Semi_major_axis，Mass，Radius，Stellar_luminosity，Stellar_mass，Stellar_radius）
  * esi：行星与地球的相似度
  * habitable：是否宜居（true or false）
