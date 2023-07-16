import React from "react";
import { createRoot } from 'react-dom/client';
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next) // 将 i18n 与 react-i18next 集成
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en: {
        translation: {
          lang: "English",
          Statistics : "Statistics",
          Analysis : "Analysis",
          Prediction : "Prediction",
          'Planet name': "Planet name", 
          'Orbital Period[days]' : "Orbital Period[days]",
          'Orbit Semi-Major Axis' : 'Orbit Semi-Major Axis',
          'Planet Mass' : 'Planet Mass',
          'Planet Radius' : 'Planet Radius',
          'Stellar Luminosity' : 'Stellar Luminosity',
          'Stellar Mass' : 'Stellar Mass',
          'Stellar Radius' : 'Stellar Radius',
          'ESI' : 'ESI',
          'Habitable' : 'Habitable',
          'Enter':'Enter ',
          'Predict' : 'Predict',
          'Save' : 'Save',
          'profile' : "profile",
          'planets' : 'planets',
          'Upload' : 'Upload',
          'Name' : "Name",
          'username' : "username",
          'Modify' : 'Modify',
          'Email' : 'Email',
          'email' : 'email',
          'Log out' : 'Log out',
          'Password' : 'Password',
          'password' : 'password',
          'Likes' : 'Likes',
          'My Planets':"My Planets",
          'Log in' :"Log in",
          'Username' : "Username",
          "Don't Have An Account?" : "Don't Have An Account ? ",
          'Signup' : 'Signup',
          'Sign up' : 'Sign up',
          'About us' : "About us",
          'Confirm your password' : 'Confirm your password',
          'Email Address' : 'Email Address',
          "Already Have An Account?" : "Already Have An Account?",
          'Success' :'Success',
          'Forgot Password' : 'Forgot Password',
          'Send' : 'Send',
          'verification code' : 'verification code',
          'Old name' :'Old name',
          'New name' : 'New name',
          'Old password' : 'Old password',
          'New password' : 'New password',
          'Enter your old password' : 'Enter your old password',
          'Enter your new password' : 'Enter your new password',
          'Repeat your new password' : 'Repeat your new password',
          'Enter your new name' : 'Enter your new name',
          'Modify your name' : 'Modify your name',
          'Confirm' : 'Confirm',
          'inputs can not be empty':'input can not be empty',
          'uploaded' : 'uploaded',
          'The two passwords are different':'The two passwords are different',
          'collect' :'collect',
          'My planets' :'My planets',
          'See in starmap':'See in starmap',
          'Picture message' :'Picture',
          "All Planets" : 'All Planet-Data',
          'Blue Space' : 'Exoplanet Habitability Analysis System',
          'BLUE SPACE' : 'Exoplanet Habitability Analysis System',
          'Welcome to Exoplanet habitability analysis System' : 'Welcome to Exoplanet habitability analysis System',
          'Blue Space team' : '🚀 Blue Space Project Team 🚀',
          'Introduction' : 'Instructions',
          'Introduction message1' : 'This website is an exoplanet habitability analysis system. At present, the page you are on is a star map. In the star map, you can click the middle mouse button to move the Angle of view, or slide the wheel to zoom, and click the planet to take a spaceship to the planet and view its information.',
          'Introduction message2' : 'If you want to view all planet data, please log in and click the statistics bar on the Prediction page in the upper left submenu to view the statistics chart. After recording, click the Prediction page in the upper left submenu to view the statistical chart.',
          'Introduction message3' : 'If you want to experience the Prediction function, please log in and click the prediction bar in the Prediction page in the upper left corner submenu to make the prediction and save the result.',
          'Introduction message4' : 'Move the view by clicking and dragging the scroll wheel.',
          'Introduction message5' : 'Zoom the view by scrolling the scroll wheel.',
          'Introduction message6' : 'View planet information by clicking the mouse.',
          'Introduction message7' : 'Fly in the cosmic space with WASD.',
          'Predicion Menu' : 'Statistics and Prediction',
          'Operation Introduction': 'Operation Introduction',
          'Planet habitability' :'Planet habitability',
          'ESI message' : 'The similarity to Earth between 0 and 1',
          'delete' : 'delete',
          'DataSource: NASA EXOPLANET ARCHIVE': 'DataSource: NASA EXOPLANET ARCHIVE'
        }
      },
      zh: {
        translation: {
          lang: "中文",
          Statistics : "统计",
          Analysis : "分析",
          Prediction : "预测",
          'Planet name': "行星名", 
          'Orbital Period[days]' : "行星轨道周期[天数]",
          'Orbit Semi-Major Axis' : '行星轨道的半长轴长度',
          'Planet Mass' : '行星质量',
          'Planet Radius' : '行星半径',
          'Stellar Luminosity' : '所属恒星光度',
          'Stellar Mass' : '所属恒星质量',
          'Stellar Radius' : '所属恒星半径',
          'ESI' : '地球相似度',
          'Habitability' : '宜居情况',
          'Enter':'输入',
          'Predict' : '预测',
          'Save' : '保存',
          'profile' : "个人信息",
          'planets' : '行星',
          'Upload' : '上传',
          'Name' : "用户名",
          'username' : "用户名",
          'Modify' : '修改',
          'Email' : '邮箱',
          'email' : '邮箱',
          'Log out' : '退出登录',
          'Password' : '密码',
          'password' : '密码',
          'Likes' : '收藏的行星',
          'My Planets':"我保存的行星",
          'Log in' :"登录",
          'Username' : "用户名",
          "Don't Have An Account?" : "没有账号 ? ",
          'Signup' : '注册',
          'Sign up' : '注册',
          'Register' : '注册',
          'About us' : "关于我们",
          'Confirm your password' : '确认密码',
          'Email Address' : '邮箱地址',
          "Already Have An Account?" : "已有账号 ? ",
          'Success' :'成功',
          'Forgot Password' : '忘记密码',
          'Send' : '发送',
          'verification code' : '验证码',
          'Old name' :'用户名',
          'email has been sent.':'邮件已发送',
          'New name' : '新用户名',
          'Old password' : '旧密码',
          'New password' : '新密码',
          'Enter your old password' : '输入旧密码',
          'Enter your new password' : '输入新密码',
          'Repeat your new password' : '重复新密码',
          'Enter your new name' : '输入新用户名',
          'Modify your name' : '修改用户名',
          'Confirm' : '确认',
          'inputs can not be empty':'输入不能为空',
          'uploaded' : '上传成功',
          'The two passwords are different':'两次输入的密码不同',
          'collect' :'收藏',
          'My planets' :'我的星球',
          'Planet name message':'自定义星球的名称',
          'Orbital Period[days] message':'行星轨道周期,以天数为单位,表示行星绕恒星运动的周期,如地球为365',
          'Orbit Semi-Major Axis message':'行星绕恒星旋转平面的半长轴长度,输入地球的倍数,为1时表示与地球的轨道半长轴长度相同',
          'Planet Mass message' : '行星质量,以1个地球质量为单位,为1时表示与地球质量相同',
          'Planet Radius message' : '行星半径,以1个地球半径为单位,为1时表示与地球半径相同',
          'Stellar Luminosity message' : '所属恒星光度,为0时表示和太阳照射地球的光度相同',
          'Stellar Mass message' : '所属恒星质量,以一个太阳质量为单位,为1时表示和太阳质量相同',
          'Stellar Radius message' : '所属恒星半径,以1个太阳半径为单位,为1时表示与太阳半径相同',
          'Habitable' : '宜居的',
          'NOT Habitable' :'不宜居的',
          'See in starmap':'驾驶飞船前往',
          'Save in my planets':'保存到我的星球',
          "Predict result":' 预测结果',
          'Predict result message' : '点击预测后预测结果将在下方展示,鼠标悬浮在预测结果上可以查看预测结果,当预测数量较多时,可以拖动预测框任意调换顺序。',
          'Picture' :'图表展示',
          'Picture message' :'点击左侧结果，可以查看图表信息',
          "All Planets" : '所有行星数据',
          'go' : '前往',
          'explore the universe.' :'欢迎来到系外行星宜居度分析系统',
          'try to find your planet.' :'在这里,你可以探索宇宙,或是创建属于自己的星球',
          'Blue Space' :'系外行星宜居度分析系统',
          'BLUE SPACE' : '系外行星宜居度分析系统',
          'Welcome to Exoplanet habitability analysis System':'欢迎来到系外行星宜居度分析系统',
          'ok':'确定',
          'No prompt next time':'不再提示',
          'Production team':'制作组',
          'Blue Space team' : '🚀 蓝色空间项目组 🚀',
          'Introduction' : '说明',
          'Introduction message1' : '本网站为系外行星宜居度分析系统,目前您所在页面为星图,点击星球可以乘坐宇宙飞船前往该星球并查看其信息。',
          'Introduction message2' : '若您想查看所有行星数据,请登录后点击左上角子菜单中的统计与预测页面中的统计栏,查看统计图表。',
          'Introduction message3' : '若您想体验预测功能,请登录后点击左上角子菜单中的统计与预测页面中的预测栏,进行预测,并保存结果。',
          'Introduction message4' : '滚轮点击拖动: 移动视角。',
          'Introduction message5' : '滚轮滑动: 缩放视角。',
          'Introduction message6' : '鼠标点击: 查看星球信息。',
          'Introduction message7' : 'WASD: 翱翔于宇宙空间。',

          'Operation Introduction' : '操作说明',
          'Star Map' : '星图',
          'Prediction Menu' : '统计与预测',
          'Planet habitability': '星球宜居度',
          'ESI message' : '与地球的相似度,取值为0到1之间',
          'delete' : '删除',
          'DataSource: NASA EXOPLANET ARCHIVE': '数据来源:NASA系外行星档案',
          'Predicted habitability of the planet' : '该星球宜居度预测值',
          "The planet's data are compared to Earth's": "该星球各项数据与地球对比",
        }
      },
      jp: {
        translation: {
          lang: "日本語",
          Statistics : "統計",
          Analysis : "分析",
          Prediction : "予測",
          'Planet name': "惑星名", 
          'Orbital Period[days]' : "惑星の公転周期[日]",
          'Orbit Semi-Major Axis' : '惑星軌道の長半径長さ',
          'Planet Mass' : '惑星質量',
          'Planet Radius' : '惑星の半径',
          'Stellar Luminosity' : '星の明るさ',
          'Stellar Mass' : '星の質量',
          'Stellar Radius' : '星の半径',
          'ESI' : '地球の類似性',
          'Habitable' : '住みやすい',
          'Enter':'入力',
          'Predict' : '予測',
          'Save' : '保存',
          'profile' : "プロフィール",
          'planets' : '惑星',
          'Upload' : 'アップロード',
          'Name' : "ユーザー名",
          'username' : "ユーザー名",
          'Modify' : '改訂',
          'Email' : '郵便',
          'email' : '郵便',
          'Log out' : 'サインアウト',
          'Password' : 'パスワード',
          'password' : 'パスワード',
          'Likes' : '好きな惑星',
          'My Planets':"私が作った惑星です",
          'Log in' :"登録",
          'Username' : "ユーザー名",
          "Don't Have An Account?" : "アカウントがありませんか ? ",
          'Signup' : '創ります',
          'Sign up' : '創ります',
          'Register' : '創ります',
          'About us' : "私たちの情報",
          'Confirm your password' : 'パスワードを認証する',
          'Email Address' : '電子メールアドレス',
          "Already Have An Account?" : "すでにアカウントをお持ちですか ? ",
          'Success' :'成功です',
          'Forgot Password' : 'パスワードを忘れました',
          'Send' : '送信',
          'verification code' : '検証コード',
          'Old name' :'古い',
          'New name' : '新しい',
          'Old password' : '古い',
          'New password' : '新しい',
          'Enter your old password' : '古いパスワードを入力します',
          'Enter your new password' : '新しいパスワードを入力します',
          'Enter your new name' : '新しいユーザー名を入力します',
          'Repeat your new password' : '新しいパスワードを繰り返します。',
          'Modify your name' : 'ユーザー名を変更します',
          'Confirm' : '確認します',
          'inputs can not be empty':'入力を空にすることはできません',
          'uploaded' : 'アップロード成功です',
          'The two passwords are different':'2回で入力したパスワードが違います',
          'collect' :'収集',
          'My planets' :'私の星です',
          'Planet name message':'カスタム惑星の名前です',
          'Orbital Period[days] message':'惑星の軌道週期とは、地球が365日であるように、恒星の周りを回る惑星の運動週期を表すものです。',
          'Orbit Semi-Major Axis message':'恒星の周りの惑星の回転面の長さの半径の長さは、地球に入力され、1になると、地球の軌道長さの長さと同じです。',
          'Planet Mass message' : '恒星の周りの惑星の回転面の長さの半径の長さは、地球に入力され、1になると、地球の軌道長さの長さと同じです。',
          'Planet Radius message' : '惑星の半径は,地球1個の半径を単位とし,1の場合は地球と同じです',
          'Stellar Luminosity message' : '属する恒星の光度は,0のとき,太陽が地球に照射する光度と同じです',
          'Stellar Mass message' : '属する恒星の質量は,太陽1つの質量を単位とし,1の場合は太陽と同じ質量です',
          'Stellar Radius message' : '属する恒星の半径は,太陽1個の半径を単位とし,1の場合は太陽の半径と同じです',
          'NOT Habitable' :'住みにくいですよ',
          'See in starmap':'飛行船に乗って行きます',
          'Save in my planets':'私の星に保存します',
          "Predict result":' 結果を予測します',
          'Predict result message' : '予測をクリックすると予測結果が下に表示され、マウスを浮かして予測結果を見ることができ、予測数が多い場合は予測ボックスをドラッグして順番を入れ替えることができます。',
          'Picture' :'グラフ表示です',
          'Picture message' :'左の結果をクリックすると、グラフ情報が表示されます。',
          "All Planets" : 'すべての惑星です',
          'Blue Space' : '太陽系外惑星の居住可能性分析システム',
          'BLUE SPACE' : '太陽系外惑星の居住可能性分析システム',
          'ok':'確定です',
          'No prompt next time':'もう提示しません',
          'Production team':'製作陣です',

          'Blue Space team' : '🚀 青い空間 🚀',
          'Introduction' :'説明します',
          'Introduction message1' : 'このサイトは系外惑星の居住可能性を分析するためのシステムで、現在のページには星図が表示されています。星図では、中ボタンをクリックして視点を移動したり、ローラーをスライドさせたりすることができます。',
          'Introduction message2' : 'すべての惑星のデータを見たい場合は、ログイン後、左上のサブメニューにあるPredictionページの統計バーをクリックして、統計グラフをご覧ください。',
          'Introduction message3' : '予測機能を体験したい方は、ログインして左上のサブメニューにあるPredictionページの予測欄をクリックして予測を行い、結果を保存します。',
          
          'Introduction message4' : 'ローラークリック&ドラッグ:視点を移動します。',
          'Introduction message5' : 'ローラースライド:画角をスケーリングします。',
          'Introduction message6' : 'マウスでクリックします惑星情報を見る。',
          'Introduction message7' : 'WASD:宇宙を飛び回ります。',
          
          'Star Map' : '星図',
          'Prediction Menu' : '統計と予測です',
          'Operation Introduction':'操作説明書です',
          'Planet habitability': 'ハビタブルゾーンです',
          'ESI message' : '0から1の間の値を取ります',
          'delete' : '削除します',
          'go':'行きます',
          'DataSource: NASA EXOPLANET ARCHIVE':"データ提供元：NASA系外惑星アーカイブ",
          'Habitability':'住みやすさの状況です',
          'Predicted habitability of the planet' : '地球の居住可能性の予測値です',
          "The planet's data are compared to Earth's": "地球と比較することができます",
          'email has been sent.':'メールを送信しました。',
        }
      }
    },
    fallbackLng: "en",

    interpolation: {
      escapeValue: false // 允许在翻译文中使用html
    }
  });

export default i18n