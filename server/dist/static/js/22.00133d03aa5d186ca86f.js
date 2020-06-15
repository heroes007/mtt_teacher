(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[22],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/iview-loader/index.js?!./src/views/exercise-manage/index.vue?vue&type=script&lang=js&":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__("./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(__webpack_require__("./node_modules/@babel/runtime/helpers/objectSpread.js"));

var _tables = _interopRequireDefault(__webpack_require__("./src/components/tables.vue"));

var _FormModal = _interopRequireDefault(__webpack_require__("./src/components/FormModal.vue"));

var _ScreenFrame = _interopRequireDefault(__webpack_require__("./src/components/ScreenFrame.vue"));

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
    pageList: _Page.default
  },
  mixins: [_FormModalMixin.default, _UserMixins.default, _pageMixins.default],

  data() {
    return {
      typeArr: ['isSuper', 'select2', 'select2_1', 'searchDropDown', 'size1'],
      selectType1: false,
      organization_id: '',
      list: [],
      symptom: [],
      select2: [{
        title: '选择评分状态',
        id: 'all'
      }, {
        title: '未评分',
        id: 0
      }, {
        title: '已评分',
        id: 1
      }],
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
      operationList: [[['评分', '查看'], 'operation1']],
      symptomList: [],
      degree: null,
      score_state: null,
      patient_division: null
    };
  },

  computed: {
    columns1() {
      return [{
        title: '病例症状',
        key: 'symptom',
        align: 'left',
        minWidth: 200
      }, {
        title: '难度',
        key: '',
        minWidth: 80,
        render: (h, params) => {
          let sex = params.row.degree == 1 ? '简单' : params.row.degree == 2 ? '适中' : '困难';
          return h('span', sex);
        }
      }, {
        title: '真实姓名',
        key: 'realname',
        minWidth: 100
      }, {
        title: '评分',
        key: '',
        minWidth: 100,
        render: (h, params) => {
          let d = params.row.score_state == 1 ? params.row.score : '-';
          return h('span', d);
        }
      }, {
        title: '提交时间',
        key: 'last_time',
        minWidth: 100
      }, {
        title: '操作',
        minWidth: 260,
        operation_state: true,
        slot: 'operation',
        align: 'left',
        operation: [[['查看', '评分'], 'operation1']]
      }];
    }

  },

  beforeDestroy() {
    this.see = null;
    this.getList = null;
  },

  methods: {
    see(row, rowIndex) {
      let state = row.score_state === 1 ? 1 : row.score_state === 0 ? 2 : 0;
      let querys = {
        id: row.id,
        case_id: row.case_id,
        type: 1,
        state,
        back: 'exercise-manage',
        do_state: 1,
        score_state: row.score_state
      };
      let query = row.score_state === 1 ? (0, _objectSpread2.default)({}, querys, {
        score: row.score
      }) : querys;
      let d = {
        query,
        name: "view-reports"
      };
      this.$router.replace(d);
    },

    selectChange3(val) {
      this.patient_division = val != '全部科室' ? val : '';
      this.getList();
    },

    selectChange1(val) {
      this.organization_id = val;
      this.getList();
    },

    selectChange2_1(val) {
      this.degree = val;
      this.getList();
    },

    selectChange2(val) {
      this.score_state = val == 'all' ? '' : val;
      this.getList();
    },

    searchDropDownChange(val) {
      this.symptomList = val;
      this.getList();
    },

    getList() {
      let d = {
        page_size: this.pageSize,
        page_num: this.current,
        symptom: this.symptomList,
        degree: this.degree,
        patient_division: this.patient_division,
        organization_id: this.organization_id,
        score_state: this.score_state
      };
      (0, _postData.default)('exercise/getExerciseList', d).then(res => {
        if (res.res_code == 1) {
          this.list = res.data.list;
          this.total = res.data.count;
        }
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

/***/ "./src/views/exercise-manage/index.vue":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_878d1890___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/views/exercise-manage/inquiry.vue?vue&type=template&id=878d1890&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/views/exercise-manage/inquiry.vue?vue&type=script&lang=js&");
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_878d1890___WEBPACK_IMPORTED_MODULE_0__[/* render */ "a"],
  _index_vue_vue_type_template_id_878d1890___WEBPACK_IMPORTED_MODULE_0__[/* staticRenderFns */ "b"],
  false,
  null,
  null,
  null
  
)

component.options.__file = "inquiry.vue.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/views/exercise-manage/index.vue?vue&type=script&lang=js&":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/iview-loader/index.js?!./src/views/exercise-manage/inquiry.vue?vue&type=script&lang=js&");
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/views/exercise-manage/index.vue?vue&type=template&id=878d1890&":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/iview-loader??ref--4-1!./src/views/exercise-manage/inquiry.vue?vue&type=template&id=878d1890&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"user-manage-main"},[_c('screen',{attrs:{"selectSubjects":true,"select2":_vm.select2,"btn-type":_vm.btnType,"select-type1":_vm.selectType1,"typeArr":_vm.typeArr,"size-title1":"病例总数","size-num1":_vm.total,"searchDropDownPlaceholder":"请输入症状关键词（多选）","searchDropDown":_vm.symptom,"select2_1":_vm.difficultyList},on:{"selectChange1":_vm.selectChange1,"selectChange3":_vm.selectChange3,"selectChange2":_vm.selectChange2,"searchDropDownChange":_vm.searchDropDownChange,"selectChange2_1":_vm.selectChange2_1}}),_vm._v(" "),_c('Tables',{attrs:{"tabel-height":_vm.tableHeight,"is-serial":true,"column":_vm.columns1,"table-data":_vm.list},on:{"operation1":_vm.see}}),_vm._v(" "),_c('page-list',{staticClass:"page-main",attrs:{"current":_vm.current,"total":_vm.total,"page-size":_vm.pageSize},on:{"page-list":_vm.pageList}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/views/exercise-manage/inquiry.vue?vue&type=template&id=878d1890&
/* concated harmony reexport render */__webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* concated harmony reexport staticRenderFns */__webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });


/***/ })

}]);
