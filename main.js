'use strict';
/**
 * 주제   : CRUD를 작성한다.
 * 준비물 : localStorage
 * 
 * 사용 예시
 * 1. localStorage의 내용이 출력된다.
 * 2. 글을 작성한다.
 * 3. localStorage에 저장한다.
 * 4. 다시 localStrage의 내용을 출력한다.
 * 
 * Todo Object Example
 * {
 *   id: 1,
 *   title: "sample",
 *   content: "sample",
 * }
 * id 값은 1부터 하나씩 증가
 * title은 중복 불가(덮어쓰게 됨)
 */
const app = document.querySelector('#app');
const title = document.querySelector('#inputTitle');
const content = document.querySelector('#inputContent');
let todoList = [];
let count = 1; // 일정 번호의 시작

// 기본적인 일정 하나의 template
const template = ({id, title, content}) => 
`<div class="card border-primary mb-3" style="max-width: 18rem;">
    <div class="card-header">${id}</div>
    <div class="card-body text-primary">
    <h5 class="card-title">${title}</h5>
    <p class="card-text">${content}</p>
    </div>
</div>`;

window.addEventListener('click', e => {
    const target = e.target;

    // 버튼 클릭(boolean)
    // class에 create/update/delete-btn 있으면 True, 아니면 False 반환 
    const isCreate = target.classList.contains('create-btn'); // 저장 버튼 클릭(boolean)
    const isUpdate = target.classList.contains('update-btn'); // 수정 버튼 클릭(boolean)
    const isDelete = target.classList.contains('delete-btn'); // 삭제 버튼 클릭(boolean)
    const datasetId = target.dataset.id; // read()에서 부여한 data-id의 value
    
    if(isCreate) {
        const tititle = title.value // title 란의 입력값
        const concontent = content.value // content 란의 입력값
        create(tititle, concontent);
    }

    if(isDelete) {
        remove(datasetId);
    }

    if(isUpdate) {
        const titleEl = document.querySelector(`.title[data-id="${datasetId}"]`);
        const contentEl = document.querySelector(`.content[data-id="${datasetId}"]`);

        if(target.dataset.editing) {
            update(datasetId, titleEl.innerHTML, contentEl.innerHTML);

            titleEl.removeAttribute('contenteditable');
            contentEl.removeAttribute('contenteditable');
            target.innerHTML = '수정';
            target.dataset.editing = false;
        } else {
            titleEl.contentEditable = true;
            contentEl.contentEditable = true;
            target.dataset.editing = true;
            target.innerHTML = '확인';
        }
    }
});


// array 인 todoList에 object 추가(push)
const create = (title, content) => {
    todoList.push({
        id: count++, 
        title: title, 
        content: content
    });
    saveData(todoList);
    render();
}

const render = () => {
    todoList = getData(); // localStorage에 저장되어있는 todoList를 불러 옴
    
    if(todoList.length == 0) {
        // localStorage에 data가 없을 때
        count = 1;
    } else {
        count = todoList[todoList.length - 1].id + 1;
    }

    app.innerHTML = '';
    todoList.forEach(({id, title, content})=>{
        app.innerHTML += `
        <div>id: ${id}</div>
        <div class="title text-muted" data-id="${id}">${title}</div>
        <div class="content" data-id="${id}">${content}</div>
        <button type="button" class="update-btn btn btn-warning" data-id="${id}">수정</button>
        <button type="button" class="delete-btn btn btn-danger" data-id="${id}">삭제</button>
        <hr>
        `;
    }); 
}
        
render();

const update = (id, title, content) => {
    todoList = todoList.map(item => {
        if(item.id == id) {
            item.title = title;
            item.content = content;
        }
        return item;
    });
    saveData(todoList);
    render();
}

const remove = (datasetId) => {
    todoList = todoList.filter((element) => {
        return datasetId != element.id
    })
    saveData(todoList);
    render();
}

function getData() {
    // todoList에 data가 있으면(truethy) parse() 적용 아니면 [] 반환
    return JSON.parse(localStorage.getItem('todo')) || [];
}

function saveData() {
    // 작성한 todoList내용을 JSON형태로 변환해 localStorage에 저장
    localStorage.setItem('todo', JSON.stringify(todoList));
}