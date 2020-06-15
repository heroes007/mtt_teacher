(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[17],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/iview-loader/index.js?!./src/views/UserManage/ListInstitutions/distribution-case/index.vue?vue&type=script&lang=js&":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__("./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tables = _interopRequireDefault(__webpack_require__("./src/components/tables.vue"));

var _ScreenFrame = _interopRequireDefault(__webpack_require__("./src/components/ScreenFrame.vue"));

var _jurisdictionList = _interopRequireDefault(__webpack_require__("./src/views/UserManage/jurisdictionList.js"));

var _UserMixins = _interopRequireDefault(__webpack_require__("./src/views/UserManage/Mixins/UserMixins.js"));

var _postData = _interopRequireDefault(__webpack_require__("./src/api/postData.js"));

var _Page = _interopRequireDefault(__webpack_require__("./src/components/Page.vue"));

var _pageMixins = _interopRequireDefault(__webpack_require__("./src/views/mixins/pageMixins.js"));

var _default = {
  name: "ManagementList",
  components: {
    Tables: _tables.default,
    screen: _ScreenFrame.default,
    pageList: _Page.default
  },
  mixins: [_UserMixins.default, _pageMixins.default],

  data() {
    return {
      typeArr: ['select2_1', 'searchDropDown', 'size1', 'back', 'button', 'select2_2'],
      selectState: [{
        id: 'all',
        title: '全部状态'
      }, {
        id: 0,
        title: '未分配'
      }, {
        id: 1,
        title: '已分配'
      }],
      selectType1: false,
      organization_id: '',
      list: [],
      symptom: [],
      difficultyList: [{
        id: 'all',
        title: '选择难度'
      }, {
        id: 1,
        title: '简单'
      }, {
        id: 2,
        title: '适中'
      }, {
        id: 3,
        title: '困难'
      }],
      operationList: [['查看', 'operation1']],
      symptomList: [],
      degree: null,
      counts: 0,
      visibilityBtn: 'btn-hide',
      patient_division: null,
      selectionList: [],
      select_count: 0,
      select_state: null
    };
  },

  computed: {
    columns1() {
      return [{
        title: '症状',
        key: 'symptom',
        align: 'left',
        minWidth: 200
      }, {
        title: '所属科室',
        key: 'patient_division',
        align: 'left',
        minWidth: 150
      }, {
        title: '难度',
        key: '',
        minWidth: 80,
        render: (h, params) => {
          let sex = params.row.degree == 1 ? '简单' : params.row.degree == 2 ? '适中' : '困难';
          return h('span', sex);
        }
      }, {
        title: '患者姓名',
        key: 'patient_name',
        minWidth: 100
      }, {
        title: '性别',
        key: '',
        minWidth: 80,
        render: (h, params) => {
          let sex = this.$config.setSex(params.row.patient_gender);
          return h('span', sex);
        }
      }, {
        title: '年龄',
        key: 'patient_age',
        minWidth: 80
      }, {
        title: '状态',
        key: '',
        minWidth: 100,
        render: (h, params) => {
          return h('span', {
            style: params.row.select_state ? {
              color: '#4098FF'
            } : {}
          }, params.row.select_state ? '已分配' : '未分配');
        }
      }, {
        title: '操作',
        minWidth: 260,
        slot: 'operation',
        align: 'left',
        operation: [['查看', 'operation1']]
      }];
    }

  },

  beforeDestroy() {
    this.see = null;
    this.deletes = null;
    this.getList = null;
  },

  methods: {
    setInit() {
      this.visibilityBtn = 'btn-visible';
    },

    selectTables(selection) {
      this.selectionList = selection;
      this.setInit();
    },

    onSelectAll(selection) {
      this.selectionList = selection;
      this.setInit();
    },

    see(row, rowIndex) {},

    selectChange3(val) {
      this.patient_division = val != '全部科室' ? val : '';
      this.getList();
    },

    selectChange2_1(val) {
      this.degree = val;
      this.getList();
    },

    selectChange2_2(val) {
      this.select_state = val;
      this.getList();
    },

    searchDropDownChange(val) {
      this.symptomList = val;
      this.getList();
    },

    setSeldata(d) {
      let arr = [];
      d.map(t => {
        arr.push(t.id);
      });
      return arr;
    },

    handleClick() {
      let d = {
        cases_ids: this.selectionList.length > 0 ? this.setSeldata(this.selectionList) : [],
        organization_id: +this.$route.query.organization_id
      };
      (0, _postData.default)('user/divideCases', d).then(res => {
        if (res.res_code == 1) this.$Message.success('病例分配成功');
      });
    },

    getList() {
      let d = {
        page_size: this.pageSize,
        page_num: this.current,
        sql_symptom: this.symptomList,
        organization_id: +this.$route.query.organization_id,
        degree: this.degree,
        patient_division: this.patient_division,
        select_state: this.select_state
      };
      (0, _postData.default)('user/getCases', d).then(res => {
        if (res.res_code == 1) {
          this.list = res.data.list;
          this.total = res.data.count;
          this.select_count = res.data.select_count;
          this.counts = this.select_count + '/' + this.total;

          if (this.list.length > 0) {
            this.list.map(t => {
              t._checked = t.select_state ? true : false;
            });
          }
        }
      });
    },

    handleBack() {
      this.$router.push({
        name: 'user-manage'
      });
    },

    getSymptom() {
      (0, _postData.default)('common/getSymptoms').then(res => {
        if (res.res_code == 1) {
          this.symptom = res.data;

          if (this.symptom.length > 0) {
            this.symptom.map(t => {
              t.id = t.symptom;
              t.title = t.symptom;
            });
          }
        }
      });
    }

  },

  mounted() {
    this.tableHeight = window.innerHeight - 200;
    this.getList();
    this.getSymptom();
  }

};
exports.default = _default;

/***/ }),

/***/ "./src/views/UserManage/ListInstitutions/distribution-case/index.vue":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_2f5312fd___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/views/UserManage/ListInstitutions/distribution-case/inquiry.vue?vue&type=template&id=2f5312fd&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/views/UserManage/ListInstitutions/distribution-case/inquiry.vue?vue&type=script&lang=js&");
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_2f5312fd___WEBPACK_IMPORTED_MODULE_0__[/* render */ "a"],
  _index_vue_vue_type_template_id_2f5312fd___WEBPACK_IMPORTED_MODULE_0__[/* staticRenderFns */ "b"],
  false,
  null,
  null,
  null
  
)

component.options.__file = "inquiry.vue.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/views/UserManage/ListInstitutions/distribution-case/index.vue?vue&type=script&lang=js&":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/iview-loader/index.js?!./src/views/UserManage/ListInstitutions/distribution-case/inquiry.vue?vue&type=script&lang=js&");
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/views/UserManage/ListInstitutions/distribution-case/index.vue?vue&type=template&id=2f5312fd&":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/iview-loader??ref--4-1!./src/views/UserManage/ListInstitutions/distribution-case/inquiry.vue?vue&type=template&id=2f5312fd&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"user-manage-main"},[_c('screen',{attrs:{"selectSubjects":true,"btn-type":_vm.btnType,"select-type1":_vm.selectType1,"typeArr":_vm.typeArr,"size-title1":"机构病例","size-num1":_vm.counts,"btn-name":"保存","select2_2":_vm.selectState,"visibilityBtn":_vm.visibilityBtn,"searchDropDownPlaceholder":"请输入症状关键词（多选）","searchDropDown":_vm.symptom,"select2_1":_vm.difficultyList},on:{"handleBack":_vm.handleBack,"selectChange3":_vm.selectChange3,"selectChange2_2":_vm.selectChange2_2,"searchDropDownChange":_vm.searchDropDownChange,"selectChange2_1":_vm.selectChange2_1,"handleClick":_vm.handleClick}}),_vm._v(" "),_c('Tables',{attrs:{"tabel-height":_vm.tableHeight,"isSelection":"","is-serial":true,"column":_vm.columns1,"table-data":_vm.list},on:{"operation1":_vm.see,"on-select-all":_vm.onSelectAll,"select-tables":_vm.selectTables}}),_vm._v(" "),_c('page-list',{staticClass:"page-main",attrs:{"current":_vm.current,"total":_vm.total,"page-size":_vm.pageSize},on:{"page-list":_vm.pageList}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/views/UserManage/ListInstitutions/distribution-case/inquiry.vue?vue&type=template&id=2f5312fd&
/* concated harmony reexport render */__webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* concated harmony reexport staticRenderFns */__webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });


/***/ }),

/***/ "./src/views/UserManage/Mixins/UserMixins.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__("./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _postData = _interopRequireDefault(__webpack_require__("./src/api/postData.js"));

var _default = {
  data() {
    return {
      btnType: false,
      organizationList: null,
      role_id: JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id,
      tableHeight: null
    };
  },

  beforeDestroy() {
    this.list = null;
    this.getList = null;
    this.see = null;
    this.deletes = null;
    this.handleClick = null;
    this.handleSubmit = null;
    this.inputChange = null;
  },

  methods: {
    setSex(n) {
      return n ? '男' : '女';
    },

    setState(n) {
      return n === -2 ? '删除' : n === -1 ? '禁用' : '正常';
    },

    fromAddAndEdit(url, d) {
      let de = () => {
        if (this.show) this.show = false;
        this.getList();
      };

      this.$config.fnPost(url, d, de);
    },

    getOrganization() {
      (0, _postData.default)('common/getOrganizations').then(res => {
        this.organizationList = res.data;
      });
    },

    handleAuth(d) {
      if (d && d.hasOwnProperty('child')) {
        let t = d.child;
        let col = this.columns1 && this.columns1[this.columns1.length - 1] && this.columns1[this.columns1.length - 1].hasOwnProperty('operation') && this.columns1[this.columns1.length - 1].operation || null;
        t.forEach(m => {
          let n = +m.permission_code.slice(4, 6);

          if (m.type === 'btn') {
            if (m.permission_code === '010401' && col) col.push(this.operationList[0]);else if (n === 1) this.btnType = true;else if (n > 1) {
              if (this.operationList && col) col.push(this.operationList[n - 2]);else this['lectureesItem' + n] = true;
            }
          }

          if (m.type === 'select') this.selectType1 = true;

          if (m.type === 'switch') {
            let d = this.columns1[this.columns1.length - 1];
            d.isSwitch = true;
          }

          if (m.type === 'radio') this.radioType = true;
        });
      }
    }

  },

  mounted() {
    this.tableHeight = window.innerHeight - 260;
  }

};
exports.default = _default;

/***/ }),

/***/ "./src/views/UserManage/jurisdictionList.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = [{
  id: 3,
  name: '学管'
}, {
  id: 4,
  name: '导师'
}];
exports.default = _default;

/***/ })

}]);
