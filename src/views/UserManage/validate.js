export const validatePass = (rule, value, callback) => {
    if (value == ''||value == undefined)  callback(new Error('请输入账号密码'));
    else {
        var filter=/^[a-zA-Z0-9]{6,12}$/; 
        if(filter.test(value))  callback();
        else callback(new Error('请输入至少6位最多12位的字母或数字'));
    }
};
export const validateUsername = (rule, value, callback) => {
    if (value == ''||value == undefined) callback(new Error('请输入管理账号'));
    else {
        var filter=/^[a-zA-Z0-9]{1,12}$/; 
        if(filter.test(value)) callback();
        else callback(new Error('请输入至少1位最多12位的字母或数字'));
    }
};
export const validateUsername2 = (rule, value, callback) => {
    if (value == ''||value == undefined) callback(new Error('请输入机构账号'));
    else {
        var filter=/^[a-zA-Z0-9]{1,12}$/; 
        if(filter.test(value))  callback();
        else callback(new Error('请输入至少1位最多12位的字母或数字'));
    }
};
export const validateUsername3 = (rule, value, callback) => {
    if (value == ''||value == undefined) callback(new Error('请输入导师账号'));
    else {
        var filter=/^[a-zA-Z0-9]{1,12}$/; 
        if(filter.test(value)) callback();
        else callback(new Error('请输入至少1位最多12位的字母或数字'));
    }
};
export const phone = (rule, value, callback) => {
    if (value == ''||value == undefined) callback(new Error('请输入手机号'));
    else {
        var filter=/^1[3|4|5|7|8][0-9]{9}$/; 
        if(filter.test(value)) callback();
        else callback(new Error('请输入11位手机号'));
    }
};
