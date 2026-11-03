<script setup>

import { ref, watch, onBeforeUnmount,defineOptions } from 'vue'
import { wardrobeApi } from '@/apis/wardrobeApi'

defineOptions({
  name: 'AuthImage'
})

const props = defineProps({
    src: { type: String, default: '' },
    alt: { type: String, default: '' },
    fallback:{ type: String, default: ''}
})
const needAuth = (url) => url.includes('/clothes/images/')


const displaySrc = ref('')
let objectUrl = null
let requestId=0
//늦게 도착한 이전 응답이 최신 결과를 덮어쓰는 것을 막는 번호

function toRequestUrl(url){
 try{
    const u = new URL(url,window.location.origin)
    if(u.hostname =='api.wishward.cloud') return u.pathname + u.search
 }catch{

 }

 return url
}

//새주소를 먼저 화면에 반영한 뒤 이전 blob을 해제한다
function setDisplay(src, newObjectUrl=null){
 const old = objectUrl
 objectUrl = newObjectUrl
 displaySrc.value = src
 if(old) URL.revokeObjectURL(old)
}

async function load(url){
    const myId = ++requestId

    //서버가 내려주는 기본 이미지 주소는 인증 경로 아니므로 프론트 fallback으로 대체
    if(!url || url.includes('default-clothes.png')){
        setDisplay(props.fallback)
        return
    }

    if(!needAuth(url)){
        setDisplay(url)
        return
    }

    try{
        const res = await wardrobeApi.get(toRequestUrl(url),{
            baseURL:'',
            //// 인스턴스 baseURL('/api')이 또 붙어 '/api/api/...'가 되는 것을 막는다
            responseType:'blob'//이미지를 바이너리로 받는다

        })

        if(myId !==requestId) return //더 최신 요청이 있으면 결과는 무시하고 넘어간다
        const created = URL.createObjectURL(res.data)// 임시 주소 생성
        setDisplay(url, created)

    }catch(e){
       if (myId !== requestId) return
        console.error('이미지 로드 실패:', e)
        setDisplay(props.fallback)
    }

}

watch(()=>props.src, (url)=>{
    load(url)
},{immediate:true})

onBeforeUnmount(()=>{

    requestId++ //진행 중인 요청 결과가 언마운트 후 반영되지 않게 한다


    if(objectUrl) {
        URL.revokeObjectURL(objectUrl)
        objectUrl = null
    
    }
})

</script>
<template>
  <img v-if="displaySrc" :src="displaySrc" :alt="alt" />
</template>