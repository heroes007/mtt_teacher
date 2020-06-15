(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[10],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/iview-loader/index.js?!./src/views/case-manage/index.vue?vue&type=script&lang=js&":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__("./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tables = _interopRequireDefault(__webpack_require__("./src/components/tables.vue"));

var _FormModal = _interopRequireDefault(__webpack_require__("./src/components/FormModal.vue"));

var _ScreenFrame = _interopRequireDefault(__webpack_require__("./src/components/ScreenFrame.vue"));

var _SeeInfo = _interopRequireDefault(__webpack_require__("./src/components/SeeInfo.vue"));

var _seeMixin = _interopRequireDefault(__webpack_require__("./src/views/UserManage/Mixins/seeMixin.js"));

var _FormModalMixin = _interopRequireDefault(__webpack_require__("./src/views/UserManage/Mixins/FormModalMixin.js"));

var _jurisdictionList = _interopRequireDefault(__webpack_require__("./src/views/UserManage/jurisdictionList.js"));

var _UserMixins = _interopRequireDefault(__webpack_require__("./src/views/UserManage/Mixins/UserMixins.js"));

var _postData = _interopRequireDefault(__webpack_require__("./src/api/postData.js"));

var _Page = _interopRequireDefault(__webpack_require__("./src/components/Page.vue"));

var _pageMixins = _interopRequireDefault(__webpack_require__("./src/views/mixins/pageMixins.js"));

var _validate = __webpack_require__("./src/views/UserManage/validate.js");

var _default = {
  name: "ManagementList",
  components: {
    Tables: _tables.default,
    FormModal: _FormModal.default,
    screen: _ScreenFrame.default,
    see: _SeeInfo.default,
    pageList: _Page.default
  },
  mixins: [_seeMixin.default, _FormModalMixin.default, _UserMixins.default, _pageMixins.default],

  data() {
    return {
      modalTitle: '',
      typeArr: ['select2_1', 'searchDropDown', 'size1'],
      tableRow: {},
      tableRowData: {},
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
      formList: [{
        type: 'input',
        name: '真实姓名',
        field: 'realname'
      }, {
        type: 'select',
        name: '证件类型',
        field: 'types',
        selectList: [{
          id: 1,
          title: '身份证'
        }, {
          id: 2,
          title: '工号'
        }],
        selectField: ['id', 'title']
      }, {
        type: 'input',
        name: '证件号码',
        field: 'cacc'
      }, {
        type: 'input',
        name: '病例账号',
        field: 'username'
      }, {
        type: 'password',
        name: '账号密码',
        field: 'password'
      }, {
        type: 'select',
        name: '所属机构',
        field: 'organization_id',
        selectList: [{
          id: 1,
          title: '源'
        }],
        selectField: ['id', 'title']
      }],
      symptomList: [],
      degree: null,
      patient_division: null,
      rules: {
        realname: [{
          required: true,
          message: '请输入真实姓名',
          trigger: 'blur'
        }],
        cacc: [{
          required: true,
          message: '请输入证件号',
          trigger: 'blur'
        }],
        username: [{
          required: true,
          validator: _validate.validateUsername3
        }],
        password: [{
          required: true,
          validator: _validate.validatePass
        }],
        organization_id: [{
          required: true,
          message: '请选择机构'
        }],
        types: [{
          required: true,
          message: '请选择证件类型'
        }]
      }
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
          let sex = params.row.patient_gender == 'Male' ? '男' : '女';
          return h('span', sex);
        }
      }, {
        title: '年龄',
        key: 'patient_age',
        minWidth: 80
      }, {
        title: '使用次数',
        key: '',
        minWidth: 100,
        render: (h, params) => {
          return h('span', '-');
        }
      }, {
        title: '操作',
        minWidth: 260,
        slot: 'operation',
        align: 'left',
        operation: [['删除', 'operation1']]
      }];
    }

  },

  beforeDestroy() {
    this.see = null;
    this.deletes = null;
    this.getList = null;
  },

  methods: {
    see(row, rowIndex) {
      this.detailShow = true;
      this.tableRowData = row;
    },

    selectChange3(val) {
      this.patient_division = val != '全部科室' ? val : '';
      this.getList();
    },

    deletes(row, rowIndex) {
      let d = {
        id: row.id,
        organization_id: +sessionStorage.getItem('organizationId')
      };
      this.$config.deleteModal(() => {
        this.$config.fnPost('case/removeCase', d, () => {
          this.getList();
        });
      });
    },

    selectChange2_1(val) {
      this.degree = val;
      this.getList();
    },

    setOrganization() {
      if (this.organizationList) {}
    },

    searchDropDownChange(val) {
      this.symptomList = val;
      this.getList();
    },

    handleClick() {
      this.modalTitle = '添加病例';
      this.show = true;
      this.tableRow = {};
      this.setOrganization();
    },

    getList() {
      let d = {
        page_size: this.pageSize,
        page_num: this.current,
        symptom: this.symptomList,
        degree: this.degree,
        patient_division: this.patient_division
      };
      (0, _postData.default)('case/getCaseList', d).then(res => {
        if (res.res_code == 1) {
          this.list = res.data.list;
          this.total = res.data.count;
        }
      });
    },

    tableSwtich(r) {
      let d = {
        id: r.id,
        state: r.states ? 0 : -1
      };
    },

    handleSubmit(val) {
      let d = val;
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

/***/ "./src/views/UserManage/validate.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.phone = exports.validateUsername3 = exports.validateUsername2 = exports.validateUsername = exports.validatePass = void 0;

const validatePass = (rule, value, callback) => {
  if (value == '' || value == undefined) callback(new Error('请输入账号密码'));else {
    var filter = /^[a-zA-Z0-9]{6,12}$/;
    if (filter.test(value)) callback();else callback(new Error('请输入至少6位最多12位的字母或数字'));
  }
};

exports.validatePass = validatePass;

const validateUsername = (rule, value, callback) => {
  if (value == '' || value == undefined) callback(new Error('请输入管理账号'));else {
    var filter = /^[a-zA-Z0-9]{1,12}$/;
    if (filter.test(value)) callback();else callback(new Error('请输入至少1位最多12位的字母或数字'));
  }
};

exports.validateUsername = validateUsername;

const validateUsername2 = (rule, value, callback) => {
  if (value == '' || value == undefined) callback(new Error('请输入机构账号'));else {
    var filter = /^[a-zA-Z0-9]{1,12}$/;
    if (filter.test(value)) callback();else callback(new Error('请输入至少1位最多12位的字母或数字'));
  }
};

exports.validateUsername2 = validateUsername2;

const validateUsername3 = (rule, value, callback) => {
  if (value == '' || value == undefined) callback(new Error('请输入导师账号'));else {
    var filter = /^[a-zA-Z0-9]{1,12}$/;
    if (filter.test(value)) callback();else callback(new Error('请输入至少1位最多12位的字母或数字'));
  }
};

exports.validateUsername3 = validateUsername3;

const phone = (rule, value, callback) => {
  if (value == '' || value == undefined) callback(new Error('请输入手机号'));else {
    var filter = /^1[3|4|5|7|8][0-9]{9}$/;
    if (filter.test(value)) callback();else callback(new Error('请输入11位手机号'));
  }
};

exports.phone = phone;

/***/ }),

/***/ "./src/views/case-manage/index.vue":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_3479b6c8___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/views/case-manage/index.vue?vue&type=template&id=3479b6c8&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/views/case-manage/index.vue?vue&type=script&lang=js&");
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_3479b6c8___WEBPACK_IMPORTED_MODULE_0__[/* render */ "a"],
  _index_vue_vue_type_template_id_3479b6c8___WEBPACK_IMPORTED_MODULE_0__[/* staticRenderFns */ "b"],
  false,
  null,
  null,
  null
  
)

component.options.__file = "index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/views/case-manage/index.vue?vue&type=script&lang=js&":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/iview-loader/index.js?!./src/views/case-manage/index.vue?vue&type=script&lang=js&");
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/views/case-manage/index.vue?vue&type=template&id=3479b6c8&":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/iview-loader??ref--4-1!./src/views/case-manage/index.vue?vue&type=template&id=3479b6c8&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"user-manage-main"},[_c('see',{attrs:{"detail-data":_vm.tableRowData,"title":"查看信息","show-modal":_vm.detailShow},on:{"close":_vm.close}}),_vm._v(" "),_c('FormModal',{attrs:{"modal-false":true,"detail-data":_vm.tableRow,"show-modal":_vm.show,"form-list":_vm.formList,"title":_vm.modalTitle,"rule-validate":_vm.rules},on:{"close":_vm.closeModal,"from-submit":_vm.handleSubmit}}),_vm._v(" "),_c('screen',{attrs:{"selectSubjects":true,"btn-type":_vm.btnType,"select-type1":_vm.selectType1,"typeArr":_vm.typeArr,"size-title1":"病例总数","size-num1":_vm.total,"btn-name":"添加病例","searchDropDownPlaceholder":"请输入症状关键词（多选）","searchDropDown":_vm.symptom,"select2_1":_vm.difficultyList},on:{"selectChange3":_vm.selectChange3,"searchDropDownChange":_vm.searchDropDownChange,"selectChange2_1":_vm.selectChange2_1,"handleClick":_vm.handleClick}}),_vm._v(" "),_c('Tables',{attrs:{"tabel-height":_vm.tableHeight,"is-serial":true,"column":_vm.columns1,"table-data":_vm.list,"select-list":_vm.mentor},on:{"operation1":_vm.deletes,"table-swtich":_vm.tableSwtich}}),_vm._v(" "),_c('page-list',{staticClass:"page-main",attrs:{"current":_vm.current,"total":_vm.total,"page-size":_vm.pageSize},on:{"page-list":_vm.pageList}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/views/case-manage/index.vue?vue&type=template&id=3479b6c8&
/* concated harmony reexport render */__webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* concated harmony reexport staticRenderFns */__webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });


/***/ })

}]);