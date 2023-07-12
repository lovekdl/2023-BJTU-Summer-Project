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
          "Don't Have An Account?" : "Don't Have An Account?",
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
          'My Planets':"我创建的行星",
          'Log in' :"登录",
          'Username' : "用户名",
          "Don't Have An Account?" : "没有账号?",
          'Signup' : '注册',
          'Sign up' : '注册',
          'Register' : '注册',
          'About us' : "关于我们",
          'Confirm your password' : '确认密码',
          'Email Address' : '邮箱地址',
          "Already Have An Account?" : "已有账号?",
          'Success' :'成功',
          'Forgot Password' : '忘记密码',
          'Send' : '发送',
          'verification code' : '验证码',
          'Old name' :'用户名',
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
          'See in starmap':'在星图中查看',
          'Save in my planets':'保存到我的星球'
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
          "Don't Have An Account?" : "アカウントがありませんか?",
          'Signup' : '創ります',
          'Sign up' : '創ります',
          'Register' : '創ります',
          'About us' : "私たちの情報",
          'Confirm your password' : 'パスワードを認証する',
          'Email Address' : '電子メールアドレス',
          "Already Have An Account?" : "すでにアカウントをお持ちですか?",
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
        }
      }
    },
    fallbackLng: "en",

    interpolation: {
      escapeValue: false // 允许在翻译文中使用html
    }
  });

export default i18n