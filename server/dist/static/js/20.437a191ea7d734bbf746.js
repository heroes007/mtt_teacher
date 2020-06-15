(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[20],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/iview-loader/index.js?!./src/views/exam-manage/check-exam/index.vue?vue&type=script&lang=js&":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__("./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(__webpack_require__("./node_modules/@babel/runtime/helpers/objectSpread.js"));

var _ScreenFrame = _interopRequireDefault(__webpack_require__("./src/components/ScreenFrame.vue"));

var _tables = _interopRequireDefault(__webpack_require__("./src/components/tables.vue"));

var _Page = _interopRequireDefault(__webpack_require__("./src/components/Page.vue"));

var _pageMixins = _interopRequireDefault(__webpack_require__("./src/views/mixins/pageMixins.js"));

var _postData = _interopRequireDefault(__webpack_require__("./src/api/postData.js"));

var _default = {
  components: {
    screen: _ScreenFrame.default,
    tables: _tables.default,
    pageList: _Page.default
  },
  mixins: [_pageMixins.default],

  data() {
    const tit = this.$route.query.type == 1 ? '考试' : '作业';
    const selects = this.$route.query.type == 1 ? [{
      title: '全部',
      id: 'all'
    }, {
      title: '考试中',
      id: 1
    }, {
      title: '已结束',
      id: 2
    }, {
      title: '未开始',
      id: 0
    }] : [{
      title: '全部',
      id: 'all'
    }, {
      title: '未开始',
      id: 0
    }, {
      title: '已开始',
      id: 1
    }, {
      title: '已结束',
      id: 2
    }];
    return {
      typeArr: ['backgroundColor', 'back', 'select2', 'select2_1', 'input', 'size1'],
      select2: selects,
      select2Placeholder: `请选择${tit}状态`,
      select2_1: [{
        title: '选择评分状态',
        id: 'all'
      }, {
        title: '未评分',
        id: 0
      }, {
        title: '已评分',
        id: 1
      }],
      select2_1Placeholder: '请选择评分状态',
      placehodle: '搜索学员姓名/账号',
      sizeTitle1: `${tit}人数`,
      sizeNum1: 10,
      columns1: [{
        title: '用户ID',
        key: 'username'
      }, {
        title: '真实姓名',
        key: 'realname'
      }, {
        title: '状态',
        key: 'exam_state',
        render: (h, params) => {
          let d = this.$route.query.type == 1 ? params.row.exam_state : params.row.hw_state,
              text = '-';
          selects.forEach(t => {
            if (t.id == d) text = t.title;
          });
          return h('span', text);
        }
      }, {
        title: '评分',
        key: 'score'
      }, {
        title: `${tit}耗时`,
        key: 'duration'
      }, {
        title: `提交时间`,
        key: 'start_time'
      }, {
        title: '操作',
        minWidth: 260,
        operation_state: true,
        slot: 'operation',
        operation: [[['查看', '评分'], 'operation1']]
      }],
      list: [],
      keyword: '',
      exam_state: 'all',
      score_state: 'all'
    };
  },

  computed: {
    type() {
      return this.$route.query.type;
    }

  },

  mounted() {
    this.getList();
  },

  methods: {
    handleBack() {
      let url = this.type == 1 ? 'exam-manage' : 'homework-manage';
      this.$router.replace(url);
    },

    selectChange2(val) {
      this.exam_state = val;
      this.getList();
    },

    selectChange2_1(val) {
      this.score_state = val;
      this.getList();
    },

    inputChange(val) {
      this.keyword = val;
      this.getList();
    },

    appraise(row, index) {
      let exam_state = row.exam_state;
      let state = row.score_state === 1 ? 1 : row.score_state === 0 ? 2 : 0;
      let id = this.type == 1 ? {
        room_id: +this.$route.query.id
      } : {
        homework_id: +this.$route.query.id
      };
      let querys = (0, _objectSpread2.default)({
        id: row.user_id
      }, id, {
        type: +this.type + 1,
        state,
        back: 'check-exam',
        exam_state,
        score_state: row.score_state
      });
      let query = row.score_state === 1 ? (0, _objectSpread2.default)({}, querys, {
        score: row.score
      }) : querys;
      let d = {
        query,
        name: "view-reports"
      };
      this.$router.replace(d);
    },

    getList() {
      let id = +this.$route.query.id;
      let url = this.type == 1 ? 'exam/getStudentExamList' : 'homework/getStudentHomeworkList';
      let state = this.$config.setSelVal(this.exam_state);
      let d1 = this.type == 1 ? {
        room_id: id
      } : {
        homework_id: id
      };
      let d2 = this.type == 1 ? {
        exam_state: state
      } : {
        hw_state: state
      };
      let d = (0, _objectSpread2.default)({
        keyword: this.keyword,
        page_size: this.pageSize,
        page_num: this.current,
        score_state: this.$config.setSelVal(this.score_state)
      }, d1, d2);
      (0, _postData.default)(url, d).then(res => {
        if (res.res_code == 1) {
          this.list = res.data.list;
          this.total = res.data.count;

          if (this.type == 2 && this.list && this.list.length > 0) {
            this.list.map(t => t.exam_state = t.hw_state);
          }
        }
      });
    }

  }
};
exports.default = _default;

/***/ }),

/***/ "./src/views/exam-manage/check-exam/index.vue":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_0ada4fa7_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/views/exam-manage/check-exam/inquiry.vue?vue&type=template&id=0ada4fa7&scoped=true&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/views/exam-manage/check-exam/inquiry.vue?vue&type=script&lang=js&");
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_0ada4fa7_scoped_true___WEBPACK_IMPORTED_MODULE_0__[/* render */ "a"],
  _index_vue_vue_type_template_id_0ada4fa7_scoped_true___WEBPACK_IMPORTED_MODULE_0__[/* staticRenderFns */ "b"],
  false,
  null,
  "0ada4fa7",
  null
  
)

component.options.__file = "inquiry.vue.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/views/exam-manage/check-exam/index.vue?vue&type=script&lang=js&":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/iview-loader/index.js?!./src/views/exam-manage/check-exam/inquiry.vue?vue&type=script&lang=js&");
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_3_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_iview_loader_index_js_ref_4_1_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/views/exam-manage/check-exam/index.vue?vue&type=template&id=0ada4fa7&scoped=true&":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/iview-loader??ref--4-1!./src/views/exam-manage/check-exam/inquiry.vue?vue&type=template&id=0ada4fa7&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('screen',{attrs:{"type-arr":_vm.typeArr,"select2":_vm.select2,"select2_1":_vm.select2_1,"select2Placeholder":_vm.select2Placeholder,"select2_1Placeholder":_vm.select2_1Placeholder,"placehodle":_vm.placehodle,"sizeTitle1":_vm.sizeTitle1,"sizeNum1":_vm.sizeNum1},on:{"handleBack":_vm.handleBack,"selectChange2":_vm.selectChange2,"selectChange2_1":_vm.selectChange2_1,"inputChange":_vm.inputChange}}),_vm._v(" "),_c('tables',{attrs:{"column":_vm.columns1,"table-data":_vm.list},on:{"operation1":_vm.appraise}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/views/exam-manage/check-exam/inquiry.vue?vue&type=template&id=0ada4fa7&scoped=true&
/* concated harmony reexport render */__webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* concated harmony reexport staticRenderFns */__webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });


/***/ })

}]);
