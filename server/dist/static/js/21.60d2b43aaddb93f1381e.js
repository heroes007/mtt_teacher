(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[21],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/iview-loader/index.js?!./src/views/exam-manage/index.vue?vue&type=script&lang=js&":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__("./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tables = _interopRequireDefault(__webpack_require__("./src/components/tables.vue"));

var _ScreenFrame = _interopRequireDefault(__webpack_require__("./src/components/ScreenFrame.vue"));

var _postData = _interopRequireDefault(__webpack_require__("./src/api/postData.js"));

var _Page = _interopRequireDefault(__webpack_require__("./src/components/Page.vue"));

var _pageMixins = _interopRequireDefault(__webpack_require__("./src/views/mixins/pageMixins.js"));

var _default = {
  components: {
    Tables: _tables.default,
    screen: _ScreenFrame.default,
    pageList: _Page.default
  },
  mixins: [_pageMixins.default],
  props: {
    permissionItem1: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      modalTitle: '',
      tableRow: {},
      tableRowData: {},
      columns1: [{
        title: '考试标题',
        key: 'title',
        align: 'left',
        minWidth: 200
      }, {
        title: '病例数量',
        key: 'case_count',
        minWidth: 100
      }, {
        title: '参加人数',
        key: 'join_count',
        minWidth: 100
      }, {
        title: '状态',
        key: 'room_state',
        minWidth: 100,
        render: (h, param) => {
          let data = param.row.room_state == 1 ? '考试中' : param.row.room_state == -1 ? '已结束' : '未开始';
          return h('span', data);
        }
      }, {
        title: '开始时间',
        key: 'start_time',
        minWidth: 200
      }, {
        title: '结束时间',
        key: 'end_time',
        minWidth: 200
      }, {
        title: '操作',
        minWidth: 260,
        slot: 'operation',
        operation: [['查看', 'operation1'], ['编辑', 'operation2'], ['删除', 'operation3']]
      }],
      list: [],
      formList: [{
        type: 'input',
        name: '真实姓名',
        field: 'realname'
      }, {
        type: 'input',
        name: '管理账号',
        field: 'username'
      }, {
        type: 'password',
        name: '账号密码',
        field: 'password'
      }],
      rules: {
        realname: [{
          required: true,
          message: '请输入真实姓名',
          trigger: 'blur'
        }]
      },
      data1: null,
      keyword: '',
      operationList: [['查看', 'operation1'], ['编辑', 'operation2'], ['删除', 'operation3']],
      tableHeight: null,
      management: [],
      typeArr: ['isSuper', 'select2', 'input', 'size1', 'button'],
      btnType: true,
      select2Placeholder: '请选择状态',
      organization_id: null,
      select2: [{
        title: '全部状态',
        id: 'all'
      }, {
        title: '考试中',
        id: 1
      }, {
        title: '已结束',
        id: -1
      }, {
        title: '未开始',
        id: 0
      }],
      room_state: ''
    };
  },

  methods: {
    see(row, rowIndex) {
      this.$router.replace({
        name: 'check-exam',
        query: {
          type: 1,
          id: row.id
        }
      });
    },

    edit(row, rowIndex) {
      this.$router.replace({
        name: 'creat-exam',
        query: {
          id: row.id,
          type: 1
        }
      });
    },

    deletes(row, rowIndex) {
      this.$config.deleteModal(() => {
        this.$config.fnPost('exam/removeExam', {
          id: row.id
        }, () => {
          this.getList();
        });
      });
    },

    inputChange(val) {
      this.keyword = val;
      this.getList();
    },

    selectChange1(val) {
      this.organization_id = val;
      this.getList();
    },

    selectChange2(val) {
      this.room_state = val == 'all' ? '' : val;
      this.getList();
    },

    handleClick() {
      this.$router.replace({
        name: 'creat-exam',
        query: {
          type: 1
        }
      });
    },

    getList() {
      let d = {
        keyword: this.keyword,
        page_size: this.pageSize,
        page_num: this.current,
        organization_id: this.organization_id,
        room_state: this.room_state
      };
      (0, _postData.default)('exam/getRoomList', d).then(res => {
        this.list = res.data.list;
        this.total = res.data.count;
      });
    }

  },

  mounted() {
    this.getList();
    this.tableHeight = window.innerHeight - 200;
  }

};
exports.default = _default;

/***/ }),

/***/ "./src/views/exam-manage/index.vue":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_c39576c4___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/views/exam-manage/inquiry.vue?vue&type=template&id=c39576c4&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/views/exam-manage/inquiry.vue?vue&type=script&lang=js&");
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_c39576c4___WEBPACK_IMPORTED_MODULE_0__[/* render */ "a"],
  _index_vue_vue_type_template_id_c39576c4___WEBPACK_IMPORTED_MODULE_0__[/* staticRenderFns */ "b"],
  false,
  null,
  null,
  null
  
)

component.options.__file = "inquiry.vue.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/views/exam-manage/index.vue?vue&type=script&lang=js&":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/iview-loader/index.js?!./src/views/exam-manage/inquiry.vue?vue&type=script&lang=js&");
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/views/exam-manage/index.vue?vue&type=template&id=c39576c4&":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/iview-loader??ref--4-1!./src/views/exam-manage/inquiry.vue?vue&type=template&id=c39576c4&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"user-manage-main"},[_c('screen',{attrs:{"btn-type":_vm.btnType,"typeArr":_vm.typeArr,"size-title1":"考试总数","size-num1":_vm.total,"btn-name":"创建考试","select2Placeholder":_vm.select2Placeholder,"select2":_vm.select2},on:{"selectChange1":_vm.selectChange1,"inputChange":_vm.inputChange,"handleClick":_vm.handleClick,"selectChange2":_vm.selectChange2}}),_vm._v(" "),_c('Tables',{attrs:{"tabel-height":_vm.tableHeight,"is-serial":true,"column":_vm.columns1,"table-data":_vm.list,"select-list":_vm.management},on:{"operation1":_vm.see,"operation2":_vm.edit,"operation3":_vm.deletes}}),_vm._v(" "),_c('page-list',{attrs:{"current":_vm.current,"total":_vm.total,"page-size":_vm.pageSize},on:{"page-list":_vm.pageList}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/views/exam-manage/inquiry.vue?vue&type=template&id=c39576c4&
/* concated harmony reexport render */__webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* concated harmony reexport staticRenderFns */__webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });


/***/ })

}]);
