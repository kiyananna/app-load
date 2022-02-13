function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (!bytes) {
    return '0 Byte';
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}

const element = (tag, classes = [], content) => {
  const node = document.createElement(tag);

  if (classes.length) {
    // Должны передать не массив, а набор строчек, поэтому спрэд оператор)
    node.classList.add(...classes);
  }

  if (content) {
    node.textContent = content;
  }
  return node;
};

// Если ничего не передали в onUpload (пустая функция, не будет ошибок, есл ничего не передавали в optionsupload)
function noop() {}

export function upload(selector, options = {}) {
  let files = [];

  const onUpload = options.onUpload ?? noop;
  const input = document.querySelector(selector);
  const preview = element('div', ['preview']);
  // const preview = document.createElement('div');
  // preview.classList.add('preview');

  const open = element('button', ['btn'], 'Открыть');
  //const open = document.createElement('button');
  // open.classList.add('btn');
  // open.textContent = 'Открыть';

  const upload = element('button', ['btn', 'primary'], 'Загрузить');
  upload.style.display = 'none';

  if (options.multi) {
    input.setAttribute('multiple', true);
  }

  if (options.accept && Array.isArray(options.accept)) {
    input.setAttribute('accept', options.accept.join(','));
  }

  input.insertAdjacentElement('afterend', preview);
  input.insertAdjacentElement('afterend', upload);
  input.insertAdjacentElement('afterend', open);

  const triggerInput = () => input.click();
  const changeHandler = (event) => {
    if (!event.target.files.length) {
      return;
    }

    // Превращаем в массив
    files = Array.from(event.target.files);

    preview.innerHTML = '';
    upload.style.display = 'inline';

    files.forEach((file) => {
      if (!file.type.match('image')) {
        return;
      }

      // Создаем ридер
      const reader = new FileReader();

      // Перед тем, как начинаем считывать, добавляем обработчик, что как только с помощью этого ридера считаем файл, тогда выполним действия
      reader.onload = (ev) => {
        const src = ev.target.result;
        preview.insertAdjacentHTML(
          'afterbegin',
          `
       <div class="preview-image">
       <div class="preview-remove" data-name="${file.name}">&times</div>
         <img src="${src}" alt="${file.name}" />
         <div class="preview-info">
              <span>${file.name}</span>
              ${bytesToSize(file.size)}
            </div>
         </div>`,
        );
        input.insertAdjacentHTML(
          'afterend',
          `<img src="${event.target.result}"> `,
        );
      };

      // Считываем сам файл
      reader.readAsDataURL(file);
    });
  };

  const removeHandler = (event) => {
    if (!event.target.dataset) {
      return;
    }

    const { name } = event.target.dataset;

    // Обновили массив
    files = files.filter((file) => file.name !== name);

    upload.style.display = 'none';

    const block = preview
      .querySelector(`[data-name="${name}"]`)
      .closest('.preview-image');

    const parent = block;

    block.classList.add('removing');
    setTimeout(() => block.remove(), 300);
  };

  const clearPreview = (el) => {
    el.style.bottom = '4px';
    el.innerHTML = `<div class="preview-info-progress"/>`;
  };

  const upLoadHandler = () => {
    // Удаляем элемент
    // Все иконки с крестиками
    preview.querySelectorAll('.preview-remove').forEach((e) => e.remove());
    // В блоке с информацией удаляем инфо и добавляем класс с загрузкой
    const previewInfo = preview.querySelectorAll('.preview-info');
    previewInfo.forEach(clearPreview);
    onUpload(files, previewInfo);
  };

  open.addEventListener('click', triggerInput);
  input.addEventListener('change', changeHandler);
  preview.addEventListener('click', removeHandler);
  upload.addEventListener('click', upLoadHandler);
}
