import Vue from 'vue';
import VueRouter from 'vue-router';
import iView from 'view-design'

const Login = () => import('../views/Login');
const NotFound = () => import('../views/notfound');
const DashBoard = () => import('../views/DashBoard');
const UserManage = () => import('../views/UserManage/index')
const StudentComparison = () => import('../views/UserManage/StudentList/student-comparison.vue')
const ExamManage = () => import('../views/exam-manage/index')
const CreatExam = () => import('../views/exam-manage/create-exam/index')
const CheckExam = () => import('../views/exam-manage/check-exam/index')
const HomeworkManage = () => import('../views/homework-manage/index')
const CaseManage = () => import('../views/case-manage/index')
const CaseGrade = () => import('../views/case-grade/index')
const PersonalData = () => import('../views/personal-data/index');
const DistributionCase = () => import('../views/UserManage/ListInstitutions/distribution-case')
const ExerciseManage = () => import('../views/exercise-manage/index')
const ViewCases = () => import('../views/case-manage/view-cases')
const ViewTrainees = () => import('../views/UserManage/view-trainees/index.vue')
const ViewReports = () => import('../views/UserManage/view-trainees/view-reports.vue')
const CaseOutline = () => import('../views/cases-manage/case-outline')
const OutlineContent = () => import('../views/cases-manage/case-outline/outline-content')
const CaseWarehouse = () => import('../views/cases-manage/case-warehouse')
const CaseMessage = () => import('../views/cases-manage/case-warehouse/case-content/case-message')
const CaseContent = () => import('../views/cases-manage/case-warehouse/case-content')
const CaseCheck = () => import('../views/cases-manage/case-warehouse/case-content/case-check')
const InquiryWarehouse = () => import('../views/cases-manage/inquiry-warehouse')
const PhysicalWarehouse = () => import('../views/cases-manage/physical-warehouse')
const DiagnoseWarehouse = () => import('../views/cases-manage/diagnose-warehouse')
const CaseContents = () => import('../views/cases-manage/case-warehouse/case-contents')
const mentorDetails = () => import('../views/UserManage/MentorList/details')
const distributionOutline = () => import('../views/cases-manage/case-outline/distribution-outline')
const DataManagement = () => import('../views/data-management')

const demoOutline = () => import('../components/outlines')

Vue.use(VueRouter);
// 页面路由
const routes = [
    {
        path: '',
        redirect: '/login',
    },
    {
        path: '/dashboard',
        component: DashBoard,
        children: [
            {
                path: 'demoOutline',
                name: 'demoOutline',
                component: demoOutline
            },
            {
                path: 'user-manage',
                name: 'user-manage',
                component: UserManage,
            },
            {
                path: 'data-management',
                name: 'data-management',
                component: DataManagement,
            },
            // 学员对比
            {
                path: '/student-comparison',
                name: 'student-comparison',
                component: StudentComparison,
            },
            {
                path: 'distribution-case',
                name: 'distribution-case',
                component: DistributionCase,
            },
            {
                path: 'personal-data',
                name: 'personal-data',
                component: PersonalData
            },
            // 练习管理
            {
                path: 'exercise-manage',
                name: 'exercise-manage',
                component: ExerciseManage
            },
            {
                path: 'exam-manage',
                name: 'exam-manage',
                component: ExamManage
            },
            {
                path: 'creat-exam',
                name: 'creat-exam',
                component: CreatExam
            },
            {
                path: 'check-exam',
                name: 'check-exam',
                component: CheckExam
            },
            {
                path: 'homework-manage',
                name: 'homework-manage',
                component: HomeworkManage
            },
            {
                path: 'case-manage',
                name: 'case-manage',
                component: CaseManage
            },
            {
                path: 'view-cases',
                name: 'view-cases',
                component: ViewCases
            },
            {
                path: '/view-trainees',
                name: 'view-trainees',
                component: ViewTrainees,
            },
            {
                path: 'view-reports',
                name: 'view-reports',
                component: ViewReports
            },
            {
                path: 'case-grade',
                name: 'case-grade',
                component: CaseGrade
            },
            //病例管理
            {
                path: 'case-outline',
                name: 'case-outline',
                component: CaseOutline
            },
            {
                path: 'outline-content',
                name: 'outline-content',
                component: OutlineContent
            },
            {
                path: 'case-warehouse',
                name: 'case-warehouse',
                component: CaseWarehouse
            },
            {
                path: 'case-message',
                name: 'case-message',
                component: CaseMessage
            },
            {
                path: 'case-content',
                name: 'case-content',
                component: CaseContent
            },
            {
                path: 'case-contents',
                name: 'case-contents',
                component: CaseContents
            },
            {
                path: 'case-check',
                name: 'case-check',
                component: CaseCheck
            },
            {
                path: 'inquiry-warehouse',
                name: 'inquiry-warehouse',
                component: InquiryWarehouse
            },
            {
                path: 'physical-warehouse',
                name: 'physical-warehouse',
                component: PhysicalWarehouse
            },
            {
                path: 'diagnose-warehouse',
                name: 'diagnose-warehouse',
                component: DiagnoseWarehouse
            },
            {
                path: 'mentor-derails',
                name: 'mentor-derails',
                component: mentorDetails
            },
            {
                path: 'distribution-outline',
                name: 'distribution-outline',
                component: distributionOutline
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '*',
        name: 'notfound',
        component: NotFound
    }
];
// 创建一个路由对象用于管理页面的路由
const router = new VueRouter({
    mode: 'history',
    routes: routes
});
export default router;
