let env = process.env.NODE_ENV

const DEV_MEDIA_URL = 'http://sfile.9mededu.com/mtt/Data/main/Cases/'

const PRO_MEDIA_URL = 'http://sfile.9mededu.com/mtt/Data/main/Cases/'


export default env === 'development' ? DEV_MEDIA_URL : PRO_MEDIA_URL
