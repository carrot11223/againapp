import Footer from '@/components/Footer';
import {register} from '@/services/ant-design-pro/api';
import {SYSTEM_LOGO} from "@/contants";
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormText,
} from '@ant-design/pro-components';
import { message, Tabs } from 'antd';
import React, { useState } from 'react';
import { history} from 'umi';
import styles from './index.less';

const Register: React.FC = () => {

  const [type, setType] = useState<string>('account');


  const handleSubmit = async (values: API.RegisterParams) => {
    const {userPassword,checkPassword }  = values;
    if (userPassword !== checkPassword){
       message.error('两次输入的密码不一致');
       return;
     }
    try {
      // 注册
      //拦截器最后返回的就是一个code，状态码，如果code=0，说明成功
      const id = await register(values);
      if (id) {
        const defaultLoginSuccessMessage = '注册成功！';
        message.success(defaultLoginSuccessMessage);

        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        history.push({
          pathname: '/user/login',
          query,
        });
        return;
      }
      //console.log(msg);
      // 如果失败去设置用户错误信息
      //setUserLoginState(id);
    } catch (error: any) {
      const defaultLoginFailureMessage = '注册失败，请重试！';
      //如果失败了，就将错误信息放到页面上，页面的提示就会是res.description
      message.error( defaultLoginFailureMessage);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          submitter={{
            searchConfig: {
              submitText: '注册'
            }
          }}
          logo={<img alt="logo" src={SYSTEM_LOGO} />}
          title="胡萝卜社区用户管理平台"
          subTitle={'世界上最好的胡萝卜发烧友都在这里'}

          /*initialValues={{
            autoLogin: true,
          }}*/

          onFinish={async (values) => {
            await handleSubmit(values as API.RegisterParams);
          }}

        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane key="account" tab={'账号密码注册'} />
          </Tabs>


          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder="请输入账号"
                rules={[
                  {
                    required: true,
                    message: '账号是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder="请输入密码"
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min: 8,
                    message: '密码最少是八位！',
                  },
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder="请确认密码"
                rules={[
                  {
                    required: true,
                    message: '确认密码是必填项！',
                  },
                  {
                    min: 8,
                    message: '确认密码最少是八位！',
                  },
                ]}
              />
              <ProFormText
                name="planetCode"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder="请输入星球编号"
                rules={[
                  {
                    required: true,
                    message: '星球编号是必填项！',
                  },
                ]}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
           {/* <ProFormCheckbox noStyle name="autoLogin">
              自动注册
            </ProFormCheckbox>*/}
           {/* <a
              style={{
                float: 'right',
              }}
            href={"tencent://message/?uin=2929608241&Site=&Menu=yes"}>
              忘记密码请联系胡萝卜
            </a>*/}
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Register;
