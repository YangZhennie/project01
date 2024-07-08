## 后台管理系统

#### 历史记录信息

**登录模块**：完成了用户验证，二次校验，以及token的权限控制

**home-渲染菜单列表**：三部分组件化，用两层v-for将服务器的数据渲染到菜单

**home-welcome**：路由组件重定向，当跳到首页时，切换到欢迎页

**home-welcome**：
- 高亮二级菜单
需求：用户刷新仍高亮当前菜单；
原理：default-active控制高亮（需要index），通过获取/设置sessionStorage存储的index，影响数据，从而影响default-active属性
问题：问什么不直接将index存在data里？答：防止刷新时data又为空，存在浏览器可以在刷新时通过生命周期获取index

**用户模块**：用户的增删改查，分页