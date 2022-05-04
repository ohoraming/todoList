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
const title = document.querySelector('#exampleFormControlInput1');
const content = document.querySelector('#exampleFormControlTextarea1');
let todoList = [];

const template = ({id, title, content}) => `<div class="card border-primary mb-3" style="max-width: 18rem;">
    <div class="card-header">${id}</div>
    <div class="card-body text-primary">
    <h5 class="card-title">${title}</h5>
    <p class="card-text">${content}</p>
    </div>
</div>`;

window.addEventListener('click', e => {
    const target = e.target;
    const isCreate = target.classList.contains('create-btn'); // 저장 버튼 클릭(boolean)
    const isUpdate = target.classList.contains('update-btn'); // 수정 버튼 클릭(boolean)
    const isDelete = target.classList.contains('delete-btn'); // 삭제 버튼 클릭(boolean)
    const datasetId = target.dataset.id;
    
    if(isCreate) {
        const tititle = title.value // title 란의 입력값
        const concontent = content.value // content 란의 입력값
        Create(tititle, concontent);
    }

    if(isDelete) {
        Delete(datasetId);
    }

    if(isUpdate) {
        const titleEl = document.querySelector(`.title[data-id="${datasetId}"]`);
        const contentEl = document.querySelector(`.content[data-id="${datasetId}"]`);

        if(target.dataset.editing) {
            Update(datasetId, titleEl.innerHTML, contentEl.innerHTML);

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

let count = 1;

// array 인 todoList에 object 추가(push)
const Create = (title, content) => {
    todoList.push({
        id: count++, 
        title: title, 
        content: content
    });
    saveData(todoList);
    Read();
}

const Read = () => {
    todoList = getData();
    count = todoList[todoList.length - 1].id + 1;

    app.innerHTML = '';
    todoList.forEach(({id, title, content})=>{
        app.innerHTML += `
        <span>id: ${id}</span>
        <span class="title" data-id="${id}">${title}</span>
        <span class="content" data-id="${id}">${content}</span>
        <button type="button" class="update-btn btn btn-warning" data-id="${id}">수정</button>
        <button type="button" class="delete-btn btn btn-danger" data-id="${id}">삭제</button>
        <hr>
        `;
    }); 
}

Read();

const Update = (id, title, content) => {
    todoList = todoList.map(item => {
        if(item.id == id) {
            item.title = title;
            item.content = content;
        }
        return item;
    });
    saveData(todoList);
    Read();
}

const Delete = (datasetId) => {
    todoList = todoList.filter((element) => {
        return datasetId != element.id
    })
    saveData(todoList);
    Read();
}

function getData() {
    return JSON.parse(localStorage.getItem('todo')) || [];
}

function saveData() {
    localStorage.setItem('todo', JSON.stringify(todoList));
}