
const emailPattern=/^[A-Za-z0-9]+@postbank.bg$/
const allowedTypes={
    'email':'email',
    'password':'password',
    're-password':'password',
    'searchString':'string',
    'nextStatus':'string',
    'commentText':'description',
    'newDeadline':'deadlineDate'

}
export function loadFormData(data){
    let formData=Object.entries(data);
    let formDataObject={}
    let wrongFieldsObject={message:[]}
    let wrongData=false
    for (const [key,value] of formData) {
        if (!formDataObject[key]){
            formDataObject[key]=value
        }else{
            if(formDataObject[key].constructor===Array){
                formDataObject[key].push(value);
            }else{
                formDataObject[key]=[formDataObject[key]];
                formDataObject[key].push(value);
            }
        }
        
    } 
    Object.entries(formDataObject).forEach((entry)=>{
        try{
            formDataObject[entry[0]]=checkInputCorrect(entry[1],allowedTypes,entry[0])
            wrongFieldsObject[entry[0]]=false
        }catch(err){
            wrongFieldsObject[entry[0]]=true
            wrongFieldsObject.message.push(err.message);
            wrongData=true
        }
        
    })
    if (wrongData){

        wrongFieldsObject.frontEndFormChecker=true
        throw wrongFieldsObject
    }
    return formDataObject

}


export function emptyFormData(inputsWrapper){
    
    Array.from(inputsWrapper.getElementsByTagName('input'))
        
        .forEach((child)=>{
            if (child.type==='text'||child.type==='number'||child.type=='textarea'||child.type=='password')
                child.value='';
        })
    Array.from(inputsWrapper.getElementsByTagName('textarea'))
        
        .forEach((child)=>{
            if (child.type==='text'||child.type==='number'||child.type=='textarea')
                child.value='';
        })


}

 function checkInputCorrect(value,allowedTypes,type){

   let action={
    
    'password':()=>{
        if ((value===''||value.length<3)){
            throw new Error(type+': Паролата следва да бъде поне 3 символа');
        }
        return value
    },
    
    'string':()=>{
        if ((value==='')){
            throw new Error(type+' Не може да бъде празно поле');
        }
        return value
    },
   
    'description':()=>{
        if(value.length<15){
            throw new Error('описанието трябва да е поне 15 символа');
        }
        return value
    },
    'email':()=>{
        value=value.trim();
        let testForMatch=emailPattern.test(value);
            if(!testForMatch){
                throw new Error('Мейла не е в очаквания формат username@postbank.bg!')
            }
        return value
    },
    'deadlineDate':()=>{
        let today=new Date(Date.now())
        today.setHours(0,0,0,0);
        let valueAsDate=new Date(value)
        valueAsDate.setHours(0,0,0,0);
        if ((valueAsDate<today)||(!value)){
            throw new Error('Крайният срок е задължително поле и не може да бъде минала дата');
        }
        return value
    }
   }   
    return action[allowedTypes[type]]()
}

