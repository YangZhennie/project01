// 错误弹窗，当状态码不为200时显示弹窗
export const errorDialog = function (data) {
    if (data.meta.status !== 200) {
        this.$message.error(data.meta.msg);
        return
    }
};

