//get dom elements
var loginDiv = document.getElementsByClassName('login')[0];
var loginOrSignUpContainer = document.getElementById('loginOrSignupContainer');
var repeatPassword = document.getElementsByClassName('repeatPasswordInputBox')[0];
var signUpText = document.getElementsByClassName('signInUpText')[0];
var loginBtn = document.getElementById('loginBtn');
var changeText = document.getElementsByClassName('changeDisplaytext')[0];
var changeBtnText = document.getElementsByClassName('changeSignUpBtnText')[0];
let email = document.getElementsByClassName('email')[0];
let password = document.getElementsByClassName('password')[0];
let role = document.getElementById('role');
   
//hide error message
window.addEventListener('load',()=>{
    let errorMsgRePwd = document.getElementsByClassName('errorMsgRepeatPassword')[0];
    let errorMsgPwd = document.getElementsByClassName('errorMsgUserName')[0];
    let errorMsgUserName = document.getElementsByClassName('errorMsgPassword')[0];
    let companyform = document.getElementsByClassName('addexpenseWholeContainer')[0]
        $(".DashBoard").load('/Home');
    if(errorMsgPwd != null&& errorMsgRePwd!=null&&errorMsgUserName!=null){
        errorMsgPwd.style.display = "none";
        errorMsgRePwd.style.display = "none";
        errorMsgUserName.style.display = "none";
    }
    if(companyform != null){
        const urlParms = new URLSearchParams(window.location.search);
        const company = urlParms.get('company');
        const adminId = urlParms.get('id');
        document.getElementById('updateCompanyDetailsButton').value = adminId;
        console.log(company);
        if(company != undefined){
       companyform.style.visibility = 'hidden';
        }
        else{
            companyform.style.visibility='visible';
        }
    }
})
// create signin
const createSignIn = ()=>{
    if(repeatPassword != null && loginDiv != null && loginOrSignUpContainer != null && signUpText != null && loginBtn != null && changeText != null && changeBtnText != null){
        repeatPassword.style.display='block';
        signUpText.innerHTML = 'Sign In';
        loginBtn.value='Login to your account';
        loginBtn.setAttribute('onclick','loginCheck()');
        changeText.innerHTML='Don’t have an account?';
        changeBtnText.innerHTML = 'Sign Up';
        changeBtnText.setAttribute('onclick','createSignUp()');
    }
}
//create signup
const createSignUp=()=>{
    if(repeatPassword != null && loginDiv != null && loginOrSignUpContainer != null && signUpText != null && loginBtn != null && changeText != null && changeBtnText != null){
    repeatPassword.style.display='block';
    loginDiv.style.height='50vh';
    loginOrSignUpContainer.style.height='55vh';
    signUpText.innerHTML = 'Sign Up';
    loginBtn.value='Create an account';
    changeText.innerHTML='Already have a account?';
    changeBtnText.innerHTML = 'Sign In';
    loginBtn.setAttribute('onclick','SignUpCheck()')
    changeBtnText.setAttribute('onclick','createSignIn()');
    }
}

// check signup form
const SignUpCheck = ()=>{
if(email.value !=""&& password.value !="" && role.value != ""){
    let data =  {
            "email":email.value,
            "password":window.btoa(password.value),
            "role":role.value
        }
        console.log(data);
        postUserdata(data)
    }
   
    else{
        document.getElementsByClassName('errorMsgPassword')[0].style.display='block';
        document.getElementsByClassName('errorMsgPassword')[0].innerHTML='Please enter a valid details';
        }
   

}


function setRole(ele){
  role.value = ele;
}
// // check login form
const loginCheck = ()=>{
    if(email.value !=""&& password.value !=""&&role.value != ""){
        checkUser(email.value,password.value,role.value);
    }
}
// send data to server
async function postUserdata(UserData){
    fetch('/signup',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({
           UserData
        }),
    }).then(response=>{
        if(response.status == 200){
            createSignIn();
        }
        else{
            alert('please hang in there')
        }
    }).catch(err=>{
        console.log(err)
    });
}
async function checkUser(email,password,role){
    let index = email.indexOf("@");
   let  company = email.slice(0,index);
    let UserData = {
        "password":password,
        "email":email,
        "role":role[0].toUpperCase(),
    }
    fetch('/login',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({
           UserData
        }),
    }).then(response=>{
        return response.json();
    }).then(data =>{
        console.log(data);
        if(data.status == 200){
            window.location.href=`/admin?company=${company}&id=${data.id}`;
        }
        else if(data.status = 429){
            window.location.href=`/admin?id=${data.id}`;
        }
        else{
            document.getElementsByClassName('errorMsgPassword')[0].style.display='block';
            document.getElementsByClassName('errorMsgPassword')[0].innerHTML='Please enter a valid details';
        }
    }).catch(err=>{
        console.log(err)
    });
}
const addCompanyDetailsCheck = (id)=>{
    let companyName = document.getElementsByClassName('companyName')[0];
    let industryDesc = document.getElementById('description');
    let phoneNo = document.getElementById('phoneNo');
    console.log(industryDesc.value)
    if(companyName.value != "" && industryDesc.value != ""&& phoneNo.value != ""){
        let companyDetails = {
            "companyName":companyName.value,
            "industryDesc":industryDesc.value,
            "phoneNo":phoneNo.value,
            "AdminId":id,
        }
        addCompanyDetailsServer(companyDetails);
    }
    else{
        document.getElementsByClassName('error')[0].style.visibility='visible';
        const myTimeout = setTimeout(clearerrorText, 5000);
    }
}
function clearerrorText(){
   let error =  document.getElementsByClassName('error')[0]
    if(error != null){
       error.style.visibility='hidden';
    }
}
async function addCompanyDetailsServer(companyDetails){
    fetch('/addCompanyDetail',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({
          companyDetails
        }),
    }).then(response=>{
        console.log(response);
        window.location.href=`/admin?company=${companyDetails.companyName}&id=${companyDetails.AdminId}`;
    }).catch(err=>{
        console.log(err)
    });
}

$('#organization').click(function(){
    $(".DashBoard").load('/users');
});
$('#selfservice').click(function(){
    $(".DashBoard").load('/service');
});
$('#home').click(function(){
    $(".DashBoard").load('/Home');
});

































const setIntustryType=(value)=>{
  let selectTag = document.getElementById('description');
    if(value==='Custom'){
        const userValue = prompt('Hello');
        let customValue = document.createElement('option');
        customValue.value=userValue;
        customValue.innerHTML=userValue;
        selectTag.append(customValue);
        selectTag.value = userValue;
    }
    else{
        selectTag.value = value;
    }
}
// let encrypt = window.btoa("nathan")
// console.log(encrypt);
// console.log(window.atob(encrypt));

   
