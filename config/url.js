let env = process.env.NODE_ENV
const PRO_URL = 'http://api.9mededu.com/mtt_teacher/'
// const TEST_URL = 'http://api.met.xuege100.com/met/'
// const TEST_URL = 'http://api.9mededu.com/mtt_teacher_test/'
const TEST_URL = 'http://api.9mededu.com/mtt_teacher_test/'


const DEV_URL = 'http://api.9mededu.com/mtt_teacher_test/'
// const DEV_URL = 'http://192.168.6.200:5511/mtt_teacher_dev/'
// const DEV_URL = 'http://192.168.6.200:5011/mtt_teacher/'
// const DEV_URL = 'http://api.9mededu.com/mtt_teacher_test/'
// const DEV_URL = 'http://api.met.xuege100.com/mtt_teacher_test/'
// const DEV_URL = 'http://192.168.6.93:5511/mtt_teacher_dev/'

export default env == 'production' ? PRO_URL : env == 'testing' ? TEST_URL : DEV_URL
