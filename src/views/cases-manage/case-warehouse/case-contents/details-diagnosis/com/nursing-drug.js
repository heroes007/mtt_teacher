let text = '<span style="color: #EB0C0C;">*</span>'
export default {
    drugInput: [
        // {title: '药物名称', hint: "请输入药物名称", type: "input"},
        {title:  text+'药物用法', hint: "请选择用法", list:[]},
        {title:  text+'药物剂量', hint: "请输入剂量", type: "input"},
        {title:  text+'时间间隔', hint: "请选择时间间隔", list:[]},
    ],
    nursingInput: [
        {title: text+'护理等级', hint: '请选择护理等级', list:[]},
        {title: text+'护理常规', hint: "请输入护理常规", type: "input"},
        {title: text+'膳食', hint: "请选择膳食种类（多选）", list:[], multiple: true },
        {title: text+'体位', hint: "请选择体位", list:[]},
        {title: text+'护理项目', hint: "请选择护理项目（多选）", list:[], multiple: true},
        {title: text+'操作', hint: "请选择操作（多选）", list:[], multiple: true},  
    ],
}
