import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import {BookOutlined, LinkOutlined} from '@ant-design/icons';
import type {Settings as LayoutSettings} from '@ant-design/pro-components';
import {PageLoading, SettingDrawer} from '@ant-design/pro-components';
import {history, Link} from 'umi';
import defaultSettings from '../config/defaultSettings';
import {currentUser as queryCurrentUser} from './services/ant-design-pro/api';
import {RunTimeLayoutConfig} from "@@/plugin-layout/layoutExports";
import {RequestConfig} from "@@/plugin-request/request";


const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
/** 获取用户信息比较慢的时候会展示一个 loading */
/**
 * 无需登录的页面 白名单
 */
const WHITE_LIST = ['/user/register', loginPath];
export const initialStateConfig = {
  loading: <PageLoading />,
};
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
   // alert(process.env.NODE_ENV)

      return await queryCurrentUser();
    } catch (error) {
      alert("出错了....");
      //获取不到用户信息就跳转登录页
      history.push(loginPath);
    }
    return undefined;
  };

  if (WHITE_LIST.includes(history.location.pathname)) {

    return {
      // @ts-ignore
      fetchUserInfo,
      settings: defaultSettings,
    };
  }
  const currentUser = await fetchUserInfo();
  return {
    // @ts-ignore
    fetchUserInfo,
    currentUser,
    settings: defaultSettings,
  };
}
/*export const request: RequestConfig={
  timeout: 1000,
  prefix: "http://main.carrot-usercenter.asia:8000"
}*/
// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    //这里被我修改了一下username 水印
    waterMarkProps: {
      content: initialState?.currentUser?.username,

    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;

      if (WHITE_LIST.includes(location.pathname)) {
        return;
      }
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs" key="docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children: any, props: { location: { pathname: string | string[]; }; }) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};
