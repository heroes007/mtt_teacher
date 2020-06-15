export function doGroupSlice(numPerRow, data) {
    var result = [];
    for (var i = 0; i < data.length; i += numPerRow) {
        result.push(data.slice(i, i + numPerRow))
    }
    return result;
}

export function doTimeFormat(val) {
    if (val) {
        if (val == "0000-00-00 00:00:00") {
            return "不限期";
        }
        var date = new Date(val);
        var monthStr = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
        var dateStr = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
        return date.getFullYear() + '-' + monthStr + '-' + dateStr;
    } else return ""
}

export function doDateFormat(val) {
    var date = new Date(val);
    var monthStr = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
    var dateStr = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
    var hourStr = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
    var miniteStr = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
    return date.getFullYear() + '-' + monthStr + '-' + dateStr + ' ' + hourStr + ':' + miniteStr;
}

export function doOfflineCurriculumTypeFormat(val) {
    switch (val) {
        case 1: return '讲座';
        case 2: return '实践';
    }
}

export function doSortFormatCatalogList(list) {
    if (list.length === 0)
        return [];

    var groupList = [];
    var i, j;
    var existGroup;
    for (i = 0; i < list.length; i++) {
        existGroup = false;
        for (j = 0; j < groupList.length; j++) {
            if (list[i].group_orderby === groupList[j].group_orderby) {
                existGroup = true;
                groupList[j].classList.push(list[i]);
                break;
            }
        }
        if (!existGroup) {
            groupList.push({
                curriculum_id: list[i].curriculum_id,
                group_orderby: list[i].group_orderby,
                group_name: list[i].group_name,
                classList: [list[i]]
            });
        }
    }

    for (i = 0; i < groupList.length; i++) {
        groupList[i].classList.sort(function (a, b) {
            if (a.orderby < b.orderby)
                return -1;
            else if (a.orderby > b.orderby)
                return 1;
            return 0;
        });
    }

    groupList.sort(function (a, b) {
        if (a.group_orderby < b.group_orderby)
            return -1;
        else if (a.group_orderby > b.group_orderby)
            return 1;
        return 0
    });

    return groupList;
}

export function cleanHtmlLabel(val) {
    return val.replace("<[^>]*>", "");
}

import json2csv from 'json2csv'

export function exportCsv(data, fields, fileNames, fileName) {
    try {
        var result = json2csv({data: data, fields: fields, fieldNames: fileNames});
        var csvContent = "data:text/csv;charset=GBK,\uFEFF" + result;
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${(fileName || 'file')}.csv`);
        document.body.appendChild(link); // Required for FF
        link.click(); // This will download the data file named "my_data.csv".
        document.body.removeChild(link); // Required for FF

    } catch (err) {
        // Errors are thrown for bad options, or if the data is empty and no fields are provided.
        // Be sure to provide fields if it is possible that your data array will be empty.
        console.error(err);
    }
}

export function reunitPrice(val) {
    return (val).toString();
}
export const MenuList = [
    {
        name: 'user-manage',
        title: '用户管理',
        icon: 'logo-octocat',
    },
    {
        name: 'exercise-manage',
        title: '练习管理',
        icon: 'md-medkit',
    },
    {
        name: 'exam-manage',
        title: '考试管理',
        icon: 'md-medkit',
    },
    {
        name: 'homework-manage',
        title: '作业管理',
        icon: 'md-bookmarks',
    },
    {
        name: 'case-manage',
        title: '病例管理',
        icon: 'ios-paper',
        list: [
            {
                name: 'case-warehouse',
                title: '病例管理'
            },
            {
                name: 'case-outline',
                title: '病症提纲'
            },
            {
                name: 'inquiry-warehouse',
                title: '问诊模板'
            },
            {
                name: 'physical-warehouse',
                title: '体检模板'
            },
            {
                name: 'diagnose-warehouse',
                title: '辅检模板'
            },
        ],
    },
    // {
    //     name: 'data-management',
    //     title: '数据管理',
    //     icon: 'md-bookmarks',
    // },
    // {
    //     name: 'case-manage',
    //     title: '病例管理',
    //     icon: 'ios-paper',
    // }
    // {
    //     name: 'case-grade',
    //     title: '病例评分',
    //     icon: 'md-rose',
    // },
]
