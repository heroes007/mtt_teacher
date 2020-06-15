export default {
  PropsArray: def => ({ type: Array, default: def || [] }),
  PropsObject: def => ({ type: Object, default: def || {} }),
  PropsString: def => ({ type: String, default: def || '' }),
  PropsBoolean: def => ({ type: Boolean, default: def || false }),
  PropsNumber: def => ({ type: Number, default: def }),
}
