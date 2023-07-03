# Back-end README

### 1. Install & Use

* 配置MySQL数据库

  * 数据库名：`bluespace`

* 配置虚拟环境
  ```  
  conda create -n bluespace python=3.7
  conda activate bluespace
  pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt
  cd bluespace
  python manage.py runserver 0.0.0.0:8000
  ```

