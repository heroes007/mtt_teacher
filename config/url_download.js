let env = process.env.NODE_ENV
const PRO_URL = 'http://admin.met.9mededu.com//'
const TEST_URL = 'http://admin.met.xuege100.com'
const DEV_URL = ''

export default env == 'production' ? PRO_URL : env == 'testing' ? TEST_URL : DEV_URL
