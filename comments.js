'use strict';

// The sample discussion is part of the local presentation. Each clip has its own thread.
const winkComments = (() => {
  const lines = {
    'Несколько месяцев': ['Меня больше всего зацепило, как спокойно она пересчитывает месяцы.', 'После ответа врача эта пауза кажется бесконечной.'],
    'Спецзаказ': ['«Спецзаказ» прозвучало так буднично, будто у мясника об этом каждый день спрашивают.', 'Я сначала всерьёз ждал, что он расскажет про нож.'],
    'Кто поведёт?': ['Вот уж не ожидала такой рифмы посреди спора за рулём.', 'Эту поездку механики запомнят надолго.'],
    'За ковром': ['Поймал себя на том, что тоже разглядываю ковёр.', 'Несколько секунд вообще никто ничего не объясняет. И от этого ещё интереснее.'],
    'Кто у телефона?': ['Как быстро меняется голос, когда он понимает, кто звонит.', 'Я бы этот переход без звука точно пропустил.'],
    'Я тебе верил': ['Фраза про доверие в этой часовне прозвучала совсем иначе, чем я ожидала.', 'Здесь я только в самом конце выдохнул.'],
    'Какой сегодня день?': ['Уже начала смеяться про пятницу, а потом услышала ответ.', 'Самый тревожный вопрос про день недели.'],
    'Закрыто на ремонт': ['Про сына оказалось убедительнее, чем про деньги.', 'Сначала вообще не понял, почему ему так нужен этот звонок.'],
    'Игра в лесу': ['В какой момент игра перестала быть игрой? Я перемотала, чтобы услышать второй голос.', 'Когда из леса зовут Артёма, уже совсем другое ощущение.'],
    'За закрытой дверью': ['Соседи в этой истории явно слышали не один странный разговор.', 'Объяснение про духов меня застало врасплох.'],
    'Очередь за бананами': ['Начали с бананов на антресоли, а закончили разговором про людей.', 'Вот почему первый совет про бананы стоило запомнить.'],
    'Вспомни имя': ['Здорово, что дали услышать, как он сначала перебирает клички.', 'В больнице на знакомое имя уже по-другому реагируешь.'],
    'Надпись на металле': ['Я тоже пыталась прочитать это как сокращение.', 'Пришлось остановить кадр и самому посмотреть на надпись.'],
    'По протоколу': ['Кажется, оба отлично помнят, кто первым предложил обойти правила.', 'Люблю такие споры, где каждому есть что припомнить.'],
    'Кресты на рисунках': ['У меня тоже первой была версия, что кресты считают жертв.', 'После объяснения рисунок хочется рассмотреть заново.'],
    'Что сказала бабушка?': ['Как мы вообще от леса пришли к истории про змей?', 'От бабушкиных предупреждений сразу повеяло детством.'],
    'Про черепах': ['Справку про черепах в этот момент я точно не ожидала.', 'Очень серьёзные лица делают этот разговор ещё смешнее.'],
    'На верёвке': ['Столько всего случилось, а запомнили, кто ругался.', 'За собаку я успел поволноваться.'],
    'Гость на пороге': ['Ещё секунду назад кормили с ложечки. И тут этот вопрос.', 'Мне понравилось, как звонок вклинивается в семейный разговор.'],
    'Достаточно рисунка?': ['Забавно, как один и тот же рисунок для них значит совершенно разное.', 'Хороший момент про то, какой улике ты готов поверить.']
  };
  const extraThreads = [
    ["Кто смотрел серию целиком, этот момент там так же воспринимается?", "Я сначала видел только отрывок. В серии по-другому смотришь на начало разговора.", "У меня примерно то же впечатление, просто уже знаешь, кто есть кто.", "Да, мне даже больше понравился второй раз.", "Я сейчас как раз смотрю сезон. Потом вернусь сюда сравнить."],
    ["Хочу сказать спасибо за субтитры. В дороге без наушников очень выручают.", "Я так и смотрела, до дома. Потом включила со звуком.", "У меня наоборот: ловлю интонацию на слух, а какое-то слово дочитываю.", "Тоже сначала читаю, потом пересматриваю лица.", "Отправила маме, она всегда просит с текстом."],
    ["Кому ещё после такого отрывка хочется сразу открыть серию?", "Я уже открыл, прощай свободный вечер.", "Мне как раз нужен был сериал на выходные.", "Сохранила себе. Одну серию точно попробую.", "Красиво зашёл посмотреть одно видео и завис на весь вечер."],
    ["Поставила на паузу и попыталась угадать, что дальше. Вообще мимо.", "Я тоже придумал совсем другое продолжение.", "А у меня со второго раза всё сложилось.", "Люблю так делать с короткими сценами, главное заранее в комментарии не заглядывать.", "Пойду попробую на следующем ролике."],
    ["Мне нравится, когда после реплики камера ещё чуть-чуть остаётся на лице.", "Пока читаешь слова, легко прозевать выражение глаз.", "Я специально смотрела второй раз только на лица.", "Есть такое. Одни и те же слова можно произнести десятком способов.", "Хорошо, что на маленьком экране всё равно видно реакцию."],
    ["Отдельно послушайте, как звучит этот разговор в наушниках.", "Я сделала погромче и наконец разобрала тихие слова.", "Вечером дома проверю, сейчас только с телефона.", "Голос вообще сильно меняет впечатление.", "Спасибо, включил звук. Действительно воспринимается иначе."],
    ["Успел забыть, что это отрывок. Ждал, когда сцена продолжится.", "Тоже потянулась перемотать чуть дальше.", "А я даже не заметила, что видео уже пошло по кругу.", "Меня повтор застал ровно на мысли «что теперь будет?».", "Ушла досматривать в сериале."],
    ["Есть у этого сериала какая-то очень узнаваемая манера разговаривать.", "Особенно когда люди отвечают не сразу.", "Да, и каждый слышит в вопросе что-то своё.", "Мне поэтому диалоги здесь интереснее любых пересказов.", "Вспомнила эту манеру, хотя смотрела уже давно."],
    ["Кто тоже начал с шортсов, а не с первой серии?", "Я вообще случайно сюда попал.", "Мне этот отрывок прислала сестра.", "Мы с мужем сначала пару сцен посмотрели, потом включили сериал.", "Я наоборот после сериала ищу знакомые моменты."],
    ["Интересно, что вы заметили сначала: слова или выражение лица?", "Я слова. На лицо обратила внимание уже на повторе.", "А я сначала смотрел вообще на задний план.", "От настроения зависит. Сегодня меня сразу голос зацепил.", "Мне показалось, что лицо говорит чуть больше, чем реплика."],
    ["Кажется, я нашёл, что отправить другу вместо длинного объяснения про сериал.", "Мне так и переслали, теперь читаю обсуждение.", "Угадываю, какой у него будет первый вопрос после просмотра.", "Я обычно отправляю без подписи, пусть сначала сам посмотрит.", "Хорошая идея, у нас как раз спор, что смотреть дальше."],
    ["Люблю, когда короткая сцена даёт время самой додумать услышанное.", "И можно тут же вернуться к началу.", "Для меня самое интересное как раз между фразами.", "Я бы эту паузу при пересказе вообще забыл.", "Иногда полминуты достаточно, чтобы начать переживать за человека."],
    ["Это тот случай, когда пересказал фразу вслух и понял, что без интонации всё теряется.", "Да, у меня при пересказе получилось совершенно пресно.", "Поэтому просто показываю оригинал.", "Там ещё и ритм важен, сразу слышно.", "Читала субтитры про себя совсем другим голосом."],
    ["Смотрели вдвоём и обратили внимание на совершенно разные вещи.", "У нас так же: я про реплику, а жена про взгляд.", "Хороший повод прокрутить ещё раз и поменяться версиями.", "Вот за этим я и открываю обсуждения после ролика.", "Интересно, я даже не думала, что можно услышать это иначе."],
    ["Отметила себе этот эпизод, чтобы потом найти в серии.", "Я обычно помню сцену, а где она была — никогда.", "Запомнил по названию ролика, так проще.", "У меня уже маленький список таких моментов есть.", "Когда буду пересматривать сезон, обязательно узнаю."],
    ["Сколько времени прошло, а манеру Бокова всё ещё узнаю на слух.", "Мне тоже голос первым вспоминается.", "Я начала сериал недавно, ещё только привыкаю к героям.", "В длинной серии эти интонации особенно запоминаются.", "Забавно, как быстро возвращаешься в знакомую историю."],
    ["В коротком формате мне проще заметить, на каком слове всё меняется.", "Я пробовала отмотать прямо к середине — ощущение уже другое.", "Точно, начало иногда важнее, чем кажется сначала.", "Я наоборот понял этот момент только в самом конце.", "Захотелось переслушать самую первую фразу."],
    ["Такое интересно показывать человеку, который ничего не знает о героях.", "Я как раз этот человек. Уже хочу узнать предысторию.", "Без контекста тоже работает, по крайней мере у меня.", "Предложила другу сначала описать, как он понял отношения между ними.", "Я бы потом сравнила впечатление после целой серии."],
    ["Читаю обсуждение и каждый раз ловлю себя на том, что снова нажимаю плей.", "Аналогично, уже третий круг.", "Мне нравится сначала посмотреть самой, а потом читать чужие впечатления.", "В этот раз остановил и посмотрел внимательнее.", "Да уж, самый длинный способ посмотреть короткое видео."]
  ];
  const names = ['@Лена_в_кино', '@СтопКадр', '@Маша_смотрит', '@ПослеТитров', '@ВечернийЗал', '@Киноман'];
  const colors = ['#008579','#9b5537','#8658b3','#39597e','#477636','#a34764'];
  const svg = id => '<svg aria-hidden="true"><use href="#'+id+'"/></svg>';
  const template = html => {
    const t = document.createElement('template');
    t.innerHTML = html;
    return t.content.firstElementChild;
  };
  const form = document.querySelector('.composer');
  const field = form.querySelector('input');
  const list = document.querySelector('#content');
  const sort = document.querySelector('.sort-control select');
  const target = form.querySelector('.reply-target');
  const states = new Map();
  let current, replyTo;
  const expanded = new Set();

  function state(clip) {
    if (!states.has(clip.id)) {
      let stored;
      try { stored = JSON.parse(localStorage.getItem('wink-comments.v1.'+clip.id)); } catch {}
      states.set(clip.id, stored && Array.isArray(stored.posts) && stored.votes ? stored : {posts:[],votes:{}});
    }
    return states.get(clip.id);
  }
  function persist() {
    try { localStorage.setItem('wink-comments.v1.'+current.id,JSON.stringify(state(current))); } catch {}
  }
  function entries(clip) {
    const seed = parseInt(clip.id.slice(0,6),16), text = lines[clip.title] || [clip.title,'Пересмотрел этот фрагмент.'];
    const samples = [text[0],text[1], 'Теперь хочется посмотреть серию целиком.', 'Вернулась к началу, чтобы ещё раз услышать разговор.'];
    const make = (body,i,id,parent=null) => ({id,parent,body,name:names[(seed+i)%names.length],color:colors[(seed+i)%colors.length],age:(i%4+2)+' дн. назад',likes:Math.floor((210+seed%1300)/(i+1)),order:-i});
    const demo = [...samples.map((body,i)=>make(body,i,'s'+i)),
      make('Да, со второго раза эта деталь заметнее.',4,'r0','s0'),make(text[1].includes('?')?'Тоже об этом задумался.':'Я ещё раз пересмотрела этот момент.',5,'r1','s0'),
      make('Тоже обратил на это внимание.',6,'r2','s1')];
    // Walk all 19 threads in a stable clip-specific order, retaining stable reply IDs.
    const stride = 1 + seed % (extraThreads.length - 1);
    for (let i = 0; i < extraThreads.length && demo.length < clip.demoComments; i++) {
      const topic = (seed + i * stride) % extraThreads.length;
      const root = 'topic-' + topic;
      const thread = extraThreads[topic];
      for (let j = 0; j < thread.length && demo.length < clip.demoComments; j++) {
        const id = j === 0 ? root : root + '-reply-' + j;
        demo.push(make(thread[j], demo.length, id, j === 0 ? null : root));
      }
    }
    return demo.concat(state(clip).posts);
  }
  function count(clip) { return clip.demoComments + state(clip).posts.length; }
  function setReply(row) {
    replyTo = row;
    target.hidden = !row;
    target.querySelector('span').textContent = row ? 'Ответ '+row.name : '';
    field.placeholder = row ? 'Введите ответ' : 'Введите комментарий';
    field.setAttribute('aria-label',field.placeholder);
  }
  function reactions(row, node) {
    const votes = state(current).votes;
    const update = () => {
      node.querySelector('.up').setAttribute('aria-pressed',String(votes[row.id]===1));
      node.querySelector('.down').setAttribute('aria-pressed',String(votes[row.id]===-1));
      node.querySelector('.score').textContent = (row.likes+Number(votes[row.id]===1)).toLocaleString('ru-RU');
    };
    for (const [selector,value] of [['.up',1],['.down',-1]]) node.querySelector(selector).onclick = () => {
      votes[row.id] = votes[row.id]===value ? 0 : value;
      persist(); update();
    };
    update();
  }
  function card(row) {
    const el = template('<article class="thread-card"><span class="thread-avatar" aria-hidden="true"></span><div class="thread-body"><div class="byline"><strong></strong><time></time></div><p></p><div class="feedback"><button type="button" class="up" aria-label="Нравится комментарий">'+svg('thumb')+'<span class="score"></span></button><button type="button" class="down" aria-label="Не нравится комментарий">'+svg('thumb')+'</button><button type="button" class="respond">Ответить</button></div></div><details class="thread-more"><summary aria-label="Действия с комментарием">'+svg('dots')+'</summary><button type="button">Выделить текст</button></details></article>');
    const avatar=el.querySelector('.thread-avatar');
    avatar.textContent=row.name.replace('@','')[0]; avatar.style.background=row.color;
    el.querySelector('strong').textContent=row.name;
    el.querySelector('time').textContent=row.order>0 ? new Date(row.order).toLocaleDateString('ru-RU') : row.age;
    const paragraph=el.querySelector('p');
    paragraph.textContent=row.body;
    el.querySelector('.thread-more button').onclick=()=>{
      el.querySelector('details').open=false;
      const range=document.createRange();range.selectNodeContents(paragraph);
      const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
    };
    el.querySelector('.respond').onclick=()=>{setReply(row); field.focus();};
    reactions(row,el);
    return el;
  }
  function render() {
    const all = entries(current);
    const roots = all.filter(r=>!r.parent);
    roots.sort(sort.value==='newest' ? (a,b)=>b.order-a.order : (a,b)=>b.likes-a.likes || b.order-a.order);
    list.replaceChildren();
    for (const row of roots) {
      const group=document.createElement('section');
      group.className='thread-group';
      group.append(card(row));
      const replies=all.filter(r=>r.parent===row.id);
      if (replies.length) {
        group.classList.add('has-replies');
        const toggle=template('<button type="button" class="branch-toggle"><span></span>'+svg('chevron')+'</button>');
        const box=document.createElement('div');
        box.className='branch';
        function fold() {
          const open=expanded.has(row.id);
          toggle.setAttribute('aria-expanded',String(open));
          const n=replies.length;
          const unit = new Intl.PluralRules('ru').select(n);
          toggle.querySelector('span').textContent = n+' '+({one:'ответ',few:'ответа',many:'ответов'}[unit]||'ответа');
          box.hidden=!open;
          if(open && !box.childElementCount) replies.forEach(item=>box.append(card(item)));
        }
        toggle.onclick=()=>{ if(expanded.has(row.id)) expanded.delete(row.id); else expanded.add(row.id); fold(); };
        fold();group.append(toggle,box);
      }
      list.append(group);
    }
    const n=String(all.length);
    document.querySelector('#thread-count').textContent=n;
    document.getElementById('video-'+current.id).querySelector('.comments .count').textContent=n;
  }
  sort.onchange=()=>{render();list.scrollTop=0;};
  target.querySelector('button').onclick=()=>{setReply(null);field.focus();};
  field.oninput=()=>{form.querySelector('[type=submit]').disabled=!field.value.trim();};
  form.onsubmit=e=>{
    e.preventDefault();
    const body=field.value.trim();
    if(!body)return;
    const parent=replyTo?.parent || replyTo?.id || null;
    const row={id:crypto.randomUUID?.()||String(Date.now())+Math.random(),body,parent,name:'@Вы',color:'#3c72af',likes:0,order:Date.now()};
    state(current).posts.push(row);persist();
    if(parent) expanded.add(parent); else sort.value='newest';
    field.value='';field.oninput();setReply(null);render();
    if(!parent)list.scrollTop=0;
    else [...list.querySelectorAll('.branch .thread-card')].findLast(n=>n.querySelector('p').textContent===body)?.scrollIntoView({block:'nearest'});
  };
  const drafts = new Map();
  function open(clip, switching = false) {
    if (current) {
      if (field.value || replyTo) drafts.set(current.id, {body:field.value, replyTo});
      else drafts.delete(current.id);
    }
    current = clip;
    if (!switching) sort.value = 'popular';
    expanded.clear();
    const draft = drafts.get(clip.id);
    setReply(draft?.replyTo || null);
    field.value = draft?.body || '';
    field.oninput();
    render();
    list.scrollTop = 0;
  }
  return {open,count};
})();
