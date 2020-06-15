let env = process.env.NODE_ENV 
export default env == 'production' ? '.sw.9mededu.com' : env == 'testing' ? '.mtt.xuege100.com' : '.mtt.xuege100.com'