// 错误弹窗，当状态码不为status时显示弹窗
export const errorDialog = function (data,status=200) {
    if (data.meta.status !== status) {
        this.$message.error(data.meta.msg);
        return false // 返回false表示执行失败
    }else{
        return true // 返回true表示执行成功
    }
};
//表单新增
//前提：表单需要预验证
export const addItem = function (form, path, params, getFunction) {
    //预验证
    form.validate(async (isTrue, obj) => {
        if (!isTrue) {
            this.$message.error("提交失败，请确认输入格式！")
            return;
        }
        //验证为true则提交到服务器
        const { data } = await this.$http.post(path, params)
        // 错误弹窗：返回值false则错误，true则正确
        if (!this.$errorDialog(data,201)) return;
        //提交成功后弹出提示框，重新渲染数据
        this.$message({
            message: "添加成功！",
            type: "success",
        })
        getFunction()

    })
}
//表单编辑
//前提：表单需要预验证
export const changeItem = function (form, path, params, getFunction){
    //提交前预验证
    form.validate(async (boolean, object) => {
        if (!boolean) {
            this.$message.error("输入格式错误！");
            return;
        }
        //将数据提交到服务器
        const { data } = await this.$http.put(path, params)
        // 错误弹窗：返回值false则错误，true则正确
        if (!this.$errorDialog(data)) return;
        // 更新后关闭弹窗，更新页面表格数据
        this.$message({ message: "更新成功！", type: "success" })
        // 仅当 getFunction 存在时执行
        getFunction && getFunction()
        
    });
}

//表单删除
export const delItem = async function (path, getFunction) {
    try {
        const confirmation = await this.$confirm(
            "此操作将永久删除, 是否继续?",
            "提示",
            {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }
        );
        if (confirmation !== "confirm") return;
        const { data } = await this.$http.delete(path);
        if (!this.$errorDialog(data)) return;
        this.$message.success("删除成功！");
        getFunction();
    } catch (error) {
        console.error("Error during deletion:", error);
        this.$message.error("删除过程中出现错误，请稍后再试！");
    }
};

