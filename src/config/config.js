import $LoadingY from '../plug/loading'
import {Config} from './base'
import axios from 'axios'
import Vue from 'vue'
import {Base64} from 'js-base64';
import postData from '../api/postData'
import {Modal, Message} from 'view-design'

export default {
    // 近几天 // day
    getDay(day, newDates){
        let today = newDates || new Date();
        let targetday_milliseconds=today.getTime() + 1000*60*60*24*day;
        today.setTime(targetday_milliseconds); //注意，这行是关键代码
        let tYear = today.getFullYear();
        let tMonth = today.getMonth();
        let tDate = today.getDate();
        tMonth = this.addZero(tMonth + 1);
        tDate = this.addZero(tDate);
        return tYear+"-"+tMonth+"-"+tDate;
    },
    // 处理删除
    deleteModal(fn, text) {
        Modal.confirm({
            title: '提示',
            content: text || '确定要删除？',
            onOk: () => {
                fn()
            }
        });
    },
    // 处理增删改查
    fnPost(url, d, fn) {
        postData(url, d).then((res) => {
            if (res.res_code == 1) {
                if (res.msg && res.msg.includes('成功') && !res.msg.includes('删除') && !res.msg.includes('查询')) Message.success(res.msg);
                fn()
            }
        })
    },
    //判断一个数据是否为空
    isKey(list) {
        let isk = true
        for (let name in list) {
            if (!list[name] && list[name] == null || (Array.isArray(list[name]) && list[name].length == 0)) {
                isk = false
            } else {
                if (typeof list[name] === "object") {
                    this.isKey(list[name])
                } else {
                    isk = true
                }
            }
        }
        return isk
    },
    // 获取机构ID
    getOrganizationId(type) {
        let role_id = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id
        return type && role_id === 1 ? type : role_id !== 1 ? +sessionStorage.getItem('organizationId') : ''
    },
    // 获取证件类型
    getIdType(n) {
        if (!n || n == '-') return '-'
        let d = ['身份证', '工作证', '手机号', '学生证', '护照']
        return d[n - 1]
    },
    /* 深拷贝 */
    copy: function (obj1, obj2) {
        obj2 = obj2 || {};
        for (let name in obj1) {
            if (obj1[name] != null) {
                if (typeof obj1[name] === "object") {
                    obj2[name] = obj1[name].constructor === Array ? [] : {};
                    this.copy(obj1[name], obj2[name]);
                } else {
                    obj2[name] = obj1[name];
                }
            } else {
                obj2[name] = null;
            }
        }
        return obj2; //然后在把复制好的对象给return出去
    },
    copyArr: function(arr1, arr2) {
        arr2 = arr2 || []
        for(var i=0; i<arr1.length; i++) {
            arr2 = [...arr2, arr1[i]]
        }
        return arr2
    },
    setSelVal(val) {
        return val == 'all' ? '' : val
    },
    // 模拟考试 ABCd
    setABC(i) {
        let arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
        return arr[i]
    },
    getDiagnosisType(n) {
        const DATA = ['主要', '次要', '鉴别'];
        return DATA[n - 1]
    },
    getDiagnosisName(text) {
        let d = {'PrincipalDiagnosis': '主要', 'SecondaryDiagnosis': '次要', 'DifferentialDiagnosis': '鉴别'}
        return d[text]
    },
    //诊断：主要诊断/次要诊断/鉴别诊断
    setDiagnosis(t) {
        switch (t) {
            case 'PrincipalDiagnosis':
                return ['主要', 1]
                break
            case 'SecondaryDiagnosis':
                return ['次要', 2]
                break
            case 'DifferentialDiagnosis':
                return ['鉴别', 3]
                break
        }
    },
    // 病情描述者
    setSelf(t) {
        switch (t) {
            case 'Self':
                return '本人'
                break
            case 'Others':
                return '他人'
                break
            case 'SelfAndOthers':
                return '本人和他人'
                break
        }
    },
    setSex(name) {
        return (name == 'Male' || name == 1) ? '男' : (name == 'Female' || name === 0) ? '女' : '未选择'
    },
    // 处理 replace(/^ null$/g, '"-"') replace(/""/g, '"-"')
    setDataK(t) {
        for (let name in t) {
            if (t[name] === '' || t[name] == null) t[name] = '-'
            else if (typeof (t[name]) === 'object') this.setDataK(t[name])
        }
        return t
    },
    // 处理table replace(/^ null$/g, '"-"') replace(/""/g, '"-"')
    setDataInit(d) {
        d.map((t) => {
            for (let name in t) {
                if (t[name] === '' || t[name] == null) t[name] = '-'
            }
        })
        return d
    },
    // 获取权限
    getAuth(v) {
        let d = Base64.decode(sessionStorage.getItem('PERMISSIONS'));
        let d1 = JSON.parse(d.slice(4))
        let da = null
        d1.map((t) => {
            let n = +t.permission_code.slice(0, 2)
            if (n === v) da = t
        })
        if (da && da.hasOwnProperty('child')) return da.child
        return false
    },

    //判断管理身份
    status(n) {
        switch (n) {
            case 1:
                return '总管理员'
                break
            case 2:
                return '机构管理员'
                break
            case 3:
                return '机构老师'
                break
            default:
                return '不存在该身份'
        }
    },
    // 为小于10的数字添加0
    addZero(data) {
        if (typeof data === 'number') return data < 10 ? '0' + data : data + ''
    },
    // 格式化日期 为小于10日期 拼0
    formatDateStr: function (year, month, day) {
        return year + '/' + this.addZero(month) + ((day && this.addZero) ? '/' : '') + this.addZero(day)
    },
    // 格式化日期 YYYY/MM/DD HH:MM:SS
    formatTime(times) {
        return (times instanceof Date === true)
            ? times.getFullYear() + '/' + this.addZero(times.getMonth() + 1) + '/' + this.addZero(times.getDate()) + ' ' + this.addZero(times.getHours()) +
            ':' + this.addZero(times.getMinutes()) + ':' + this.addZero(times.getSeconds()) : times
    },
     // 格式化日期 YYYY-MM-DD HH:MM:SS
    formatTime2(times) {
        return (times instanceof Date === true)
            ? times.getFullYear() + '-' + this.addZero(times.getMonth() + 1) + '-' + this.addZero(times.getDate()) + ' ' + this.addZero(times.getHours()) +
            ':' + this.addZero(times.getMinutes()) + ':' + this.addZero(times.getSeconds()) : times
    },
    // 格式化日期 YYYY/MM/DD
    formatDate(times) {
        return (times instanceof Date === true)
            ? times.getFullYear() + '/' + this.addZero(times.getMonth() + 1) + '/' + this.addZero(times.getDate())
            : times
    },
    setLockType(d) {
        let arr = [{id: 0, title: '不限'}, {id: 1, title: '按课程'}, {id: 2, title: '按章节'}, {id: 3, title: '按视频'}]
        let d1 = ''
        arr.forEach((t) => {
            if (t.id == d) d1 = t.title
        })
        return d1
    },
    setProductState(n) {
        // -2删除 -1下架 0未上架 1测试 2上架 3推荐
        let stateText = ''
        switch (n) {
            case -2:
                stateText = '删除'
                break;
            case -1:
                stateText = '下架'
                break;
            case 0:
                stateText = '未上架'
                break;
            case 1:
                stateText = '测试'
                break;
            case 2:
                stateText = '上架'
                break;
            case 3:
                stateText = '推荐'
                break;
        }
        return stateText
    },
    // 获取当前角色的权限
    getRoleId() {
        return JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id
    },
    // 设置role_id === 4 的权限  只能查看产品 批阅作业
    setAuthTube() {
        return JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id !== 4
    },
    //table导出excel
    downExcel(th, list, excelName) {
        var title = '', content = ''
        th.forEach(item => {
            title += `<th>${item.title}</th>`
        })
        title = `<tr>${title}</tr>`
        list.forEach(item => {
            let detail = '', trs = ''
            th.forEach(it => {
                detail += `<td>${item[it.key]}</td>`
            })
            trs += `<tr>${detail}</tr>`
            content += trs
        })
        var tables = title + content
        let html = "<html><head><meta charset='utf-8' /></head><body><table>";
        html += tables;
        html += "</table></body></html>";
        var blob = new Blob([html], {type: "application/vnd.ms-excel"});
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = excelName + ".xls";
        a.click()
    },
    //阿拉伯数字转换为简写汉字
    ArabiaToSimplifiedChinese(Num) {
        for (let i = Num.length - 1; i >= 0; i--) {
            Num = Num.replace(",", "")//替换Num中的“,”
            Num = Num.replace(" ", "")//替换Num中的空格
        }
        if (isNaN(Num)) { //验证输入的字符是否为数字
            //alert("请检查小写金额是否正确");
            return;
        }
        //字符处理完毕后开始转换，采用前后两部分分别转换
        let part = String(Num).split(".");
        let newchar = "";
        //小数点前进行转化
        for (let i = part[0].length - 1; i >= 0; i--) {
            if (part[0].length > 10) {
                //alert("位数过大，无法计算");
                return "";
            }//若数量超过拾亿单位，提示
            let tmpnewchar = ""
            let perchar = part[0].charAt(i);
            switch (perchar) {
                case "0":
                    tmpnewchar = "零" + tmpnewchar;
                    break;
                case "1":
                    tmpnewchar = "一" + tmpnewchar;
                    break;
                case "2":
                    tmpnewchar = "二" + tmpnewchar;
                    break;
                case "3":
                    tmpnewchar = "三" + tmpnewchar;
                    break;
                case "4":
                    tmpnewchar = "四" + tmpnewchar;
                    break;
                case "5":
                    tmpnewchar = "五" + tmpnewchar;
                    break;
                case "6":
                    tmpnewchar = "六" + tmpnewchar;
                    break;
                case "7":
                    tmpnewchar = "七" + tmpnewchar;
                    break;
                case "8":
                    tmpnewchar = "八" + tmpnewchar;
                    break;
                case "9":
                    tmpnewchar = "九" + tmpnewchar;
                    break;
            }
            switch (part[0].length - i - 1) {
                case 0:
                    tmpnewchar = tmpnewchar;
                    break;
                case 1:
                    if (perchar != 0) tmpnewchar = tmpnewchar + "十";
                    break;
                case 2:
                    if (perchar != 0) tmpnewchar = tmpnewchar + "百";
                    break;
                case 3:
                    if (perchar != 0) tmpnewchar = tmpnewchar + "千";
                    break;
                case 4:
                    tmpnewchar = tmpnewchar + "万";
                    break;
                case 5:
                    if (perchar != 0) tmpnewchar = tmpnewchar + "十";
                    break;
                case 6:
                    if (perchar != 0) tmpnewchar = tmpnewchar + "百";
                    break;
                case 7:
                    if (perchar != 0) tmpnewchar = tmpnewchar + "千";
                    break;
                case 8:
                    tmpnewchar = tmpnewchar + "亿";
                    break;
                case 9:
                    tmpnewchar = tmpnewchar + "十";
                    break;
            }
            newchar = tmpnewchar + newchar;
        }
        //替换所有无用汉字，直到没有此类无用的数字为止
        while (newchar.search("零零") != -1 || newchar.search("零亿") != -1 || newchar.search("亿万") != -1 || newchar.search("零万") != -1) {
            newchar = newchar.replace("零亿", "亿");
            newchar = newchar.replace("亿万", "亿");
            newchar = newchar.replace("零万", "万");
            newchar = newchar.replace("零零", "零");
        }
        //替换以“一十”开头的，为“十”
        if (newchar.indexOf("一十") == 0) {
            newchar = newchar.substr(1);
        }
        //替换以“零”结尾的，为“”
        if (newchar.lastIndexOf("零") == newchar.length - 1) {
            newchar = newchar.substr(0, newchar.length - 1);
        }
        return newchar;
    },
    //判断文件类型
    opinionCategory(val) {
        switch (val) {
            case "jpg" || "png":
                return "Picture";
            case "mp4" || "mov" || "avi":
                return "Video";
            default:
                return "Audio";
        }
    },
}
