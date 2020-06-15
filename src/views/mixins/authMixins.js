export default {
    methods: {
        setAuthAdmin(){
            if(sessionStorage.getItem('PERSONALDETAILS')){
                let d = JSON.parse(sessionStorage.getItem('PERSONALDETAILS'));
                if(d.role_id === 1)  return false
                else return true
            }
        }
    }
}