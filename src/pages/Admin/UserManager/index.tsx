import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { useRef } from 'react';
import {searchUsers} from "@/services/ant-design-pro/api";
import {Image} from "antd";

const columns: ProColumns<API.CurrentUser>[] = [
  {
    title: 'id',
    dataIndex: 'id',
    valueType: 'indexBorder',
    width: 60,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    width: 60,
  },
  {
    title: '账户',
    dataIndex: 'userAccount',
    width: 60,
  },
  {
    title: '头像',
    dataIndex: 'avatarUrl',
    //渲染方式
    render: (a, record) => (
 <div>
   <Image src={record.avatarUrl} width={30}/>
 </div>
    ),
  },
  {
    title: '性别',
    dataIndex: 'gender',
    width: 60,
  },
  {
    title: '电话',
    dataIndex: 'phone',
    copyable: true,
    width: 60,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    copyable: true,
    width: 60,
  },
  {
    title: '角色',
    dataIndex: 'role',
    valueType: 'select',
    width: 60,
    valueEnum: {
      0: { text: '普通用户',status: 'Default'},
      1: {
        text: '管理员',
        status: 'Success',
      },
    },
  },
  {
    title: '用户状态',
    dataIndex: 'userStatus',
    valueType: 'select',
    width: 60,
    valueEnum: {
      0: { text: '正常用户',status: 'Default'},
      1: {
        text: '异常用户',
        status: 'Success',
      },
    },
  },
  {
    title: '创建时间',
    width: 60,
    dataIndex: 'createTime',
    valueType: 'dateTime',

  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
        ]}
      />,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<API.CurrentUser>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        console.log(sort, filter);
        const userList = await searchUsers();
        return {
          data: userList,
        }
      }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="高级表格"
    />
  );
};
