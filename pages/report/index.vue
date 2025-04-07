<template>
   <div class="report-page">
      <div v-if="isLoading" class="loading-container">
         <div class="loader"></div>
         <div class="loading-text">
            <p>Загружаем данные об автомобиле...</p>
            <span>Сформированный отчёт будет доступен вам всегда в личном кабинете</span>
         </div>
      </div>

      <div v-else>
         <div class="report-page__info">
            <div class="report-page__details">
               <h2 class="report-page__title">
                  {{ report.auto_technical_specifications[0].brand.title }}
                  {{ report.auto_technical_specifications[0].model.title }},
                  {{ report.auto_technical_specifications[0].year_release.title }}
               </h2>
               <p class="report-page__text">
                  <span class="report-page__label">Госномер:</span>
                  {{ report.auto_registration_data?.[0]?.state_number || 'Не указано' }}
               </p>
               <p class="report-page__text">
                  <span class="report-page__label">VIN:</span>
                  {{ report.auto_registration_data[0]?.vin || 'Не указано' }}
               </p>
               <div class="report-page__block">
                  <ReportInfoBlock :image="historyIcon" title="Отчёт об истории от 19 ноября 2024 года"
                     text="История отчётов" @click="toggleReportPopup" />
                  <ReportInfoBlock :image="updateIcon" title="Вы запрашивали полный отчёт вчера, возможно некоторые данные будут устаревшими
                  и неактуальными" text="Обновить отчёт" @click="openPopupHandler()" />
                  <UpdateReportPopup :isVisible="isReportPopupVisible" @close="toggleReportPopup" />
               </div>
            </div>
            <div class="report-page__slider">
               <CarSlider :images="report.photos" :adsId="report.id" :userId="report.id_user_owner_ads" />
            </div>
         </div>
         <CarReportPreview :reportDataInfo="reportDataInfo"/>
         <div class="report-page__sections">
            <ReportSection v-for="item in reportData" :key="item.id" :id="item.id" :title="item.title" :date="item.date"
               :description="item.description">
               <SmallStatusBlock v-if="item.params" :data="item.params" />
               <PtsStatsBlock v-if="item.stats" :data="item.stats" />
               <OwnersBlock v-if="item.owners" :data="item.owners" />
               <AligoAdsBlock v-if="item.history" :data="item.history" :description="item.description"
                  :seller="item.seller" :region="item.region" :price="item.price" :mileage="item.mileage"
                  :isPublished="item.isPublished" :photo="item.photo" />
               <PriceStatsBlock v-if="item.price_history" :data="item.price_history" :icon="item.icon" />
               <CharacteristicsReport v-if="item.characteristics" :data="item.characteristics" :icon="item.icon" />
               <RepairCostReport v-if="item.updates" :data="item" />
               <AccidentReport v-if="item.accidents" :data="item" />
               <MileageChart v-if="item.mileageData" :dataPoints="item.mileageData" :owners="item.ownersData" />
               <TimeLine v-if="item.timelineBlocks" :timelineBlocks="item.timelineBlocks" />
            </ReportSection>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCarById } from '~/services/apiClient';
import historyIcon from '@/assets/icons/icon-history.svg'
import updateIcon from '@/assets/icons/update-icon.svg'
import docIcon from '@/assets/icons/doc-icon.svg'
import fineIcon from '@/assets/icons/fine-icon.svg'
import testicon from '@/assets/icons/test-icon.svg'
import carplaceholderImage from '@/assets/icons/autosize-icon.svg'
import { usePayPopupStore } from '@/store/payPopupStore';

const payPopupStore = usePayPopupStore();

const openPopupHandler = () => {
   const newLabel = `Ваше авто`;
   payPopupStore.openPopup(newLabel);
};

const report = ref(null);
const isLoading = ref(true);

const reportDataInfo = [
   { id: "pts-data", title: "Данные из ПТС", text: "Найдены характеристики", status: 1 },
   { id: "leasing-contracts", title: "Договоры лизинга", text: "Нет записей", status: 1 },
   { id: "cost-evaluation", title: "Оценка стоимости", text: "4 записи", status: 1 },
   { id: "pts-owners", title: "Владельцев из ПТС", text: "2 владельца (среди них юр. лицо)", status: 2 },
   { id: "taxi-work", title: "Работа в такси", text: "Нет записей", status: 1 },
   { id: "mileage-history", title: "История пробегов", text: "Возможны манипуляции", status: 3 },
   { id: "pledge-data", title: "Данные о залоге", text: "Залог не найден", status: 1 },
   { id: "carsharing-work", title: "Работа в каршеринге", text: "Нет записей", status: 1 },
   { id: "recall-campaigns", title: "Отзывные кампании", text: "Нет записей", status: 1 },
   { id: "restrictions", title: "Наличие ограничений", text: "Нет записей", status: 1 },
   { id: "aligo-listing", title: "Размещение на Aligo", text: "1 объявление", status: 1 },
   { id: "insurance-policies", title: "Страховые полисы", text: "2 записи", status: 1 },
   { id: "wanted-status", title: "Нахождение в розыске", text: "Нет записей", status: 1 },
   { id: "accidents", title: "Участие в ДТП", text: "2 ДТП", status: 3 },
   { id: "fines", title: "Штрафы", text: "1 неоплаченный", status: 3 },
   { id: "auctions", title: "Участие в аукционах", text: "Нет записей", status: 1 },
   { id: "repair-cost", title: "Расчёт стоимости ремонта", text: "2 записи", status: 3 },
   { id: "vin-options", title: "Опции по VIN", text: "Есть записи", status: 1 },
]

const isReportPopupVisible = ref(false);

const toggleReportPopup = () => {
   isReportPopupVisible.value = !isReportPopupVisible.value;
}

const fetchReportDetails = async (id) => {
   isLoading.value = true;
   try {
      report.value = await getCarById(id);

      reportData.value = reportData.value.map((item) => {
         if (item.id === "aligo-listing") {
            return {
               ...item,
               description: report.value.ads_parameter.ads_description,
               date: report.value.created_at,
               seller: report.value.ads_parameter.username,
               region: report.value.ads_parameter.city.title,
               price: report.value.ads_parameter.amount,
               mileage: report.value.auto_history_conditions[0].mileage,
               isPublished: report.value.is_published,
               photo: report.value.photos[0].arr_title_size.preview
            };
         }
         return item;
      });

   } catch (error) {
      console.error("Ошибка при получении данных:", error);
   } finally {
      setTimeout(() => {
         isLoading.value = false;
      }, 3000);
   }
};

onMounted(() => {
   fetchReportDetails(754);
});

watchEffect(() => {
   document.body.style.overflow = isLoading.value ? 'hidden' : '';
});

const reportData = ref([
   {
      id: "pts-data",
      title: "Данные из ПТС",
      description: "Проверьте эти данные при заключении сделки, они указаны в паспорте транспортного средства. Сведения предоставляются ГИБДД.",
      date: "10 января 2025",
      stats: [
         {
            title: "Марка и модель",
            description: "Niva Sport Tri"
         },
         {
            title: "Объём двигателя",
            description: "2,9 л."
         },
         {
            title: "Номер и серия ПТС",
            description: "164301032470179"
         },
         {
            title: "Госномер",
            description: "X000XX61"
         },
         {
            title: "Мощность двигателя",
            description: "69 л. с."
         },
         {
            title: "СТС выдан",
            description: "17 августа 2025"
         },
         {
            title: "Привод",
            description: "Полный"
         },
         {
            title: "Цвет",
            description: "Черный"
         },
         {
            title: "Номер и серия СТС",
            description: "7865898786"
         },
         {
            title: "Категория ТС",
            description: "Легковой седан"
         },
         {
            title: "ПТС",
            description: "Оригинал"
         },
         {
            title: "VIN",
            description: "Z9M2130215L039344"
         },
         {
            title: "Трансмиссия",
            description: "Механическая"
         },
         {
            title: "Электронный ПТС",
            description: "Есть"
         },
         {
            title: "Номер двигателя",
            description: "838127364027840"
         },
         {
            title: "Год выпуска",
            description: "2021 г."
         },
         {
            title: "ПТС выдан",
            description: "17 августа 2025"
         }
      ]
   },
   {
      id: "leasing-contracts",
      title: "Договоры лизинга",
      description: "Лизинг — долгосрочная аренда. Автомобиль мог подвергаться сильному износу, стоит обратить внимание на его состояние.",
      date: "10 января 2025",
      params: [
         {
            title: "Не обнаружено сведений о наличии договора финансовой аренды (лизинга)",
            description: "По данным Единого федерального реестра сведений о фактах деятельности юридических лиц.",
            status: 1
         },
      ]
   },
   {
      id: "cost-evaluation",
      title: "Оценка стоимости",
      description: "Данные по оценка автомобиля от партнеров",
      date: "10 января 2025",
      icon: testicon,
      price_history: [
         {
            price_title: "1 400 000 ₽ (10 января 2021)",
            price_stats: [
               {
                  title: "Пробег",
                  description: "60 000 км",
               },
               {
                  title: "Регион",
                  description: "Ростовская обл., Ростов-на-Дону",
               },
               {
                  title: "Источник",
                  description: "Партнер Aligo.ru",
               },
            ],
         },
         {
            price_title: "1 400 000 ₽ (10 января 2021)",
            price_stats: [
               {
                  title: "Пробег",
                  description: "60 000 км",
               },
               {
                  title: "Регион",
                  description: "Ростовская обл., Ростов-на-Дону",
               },
               {
                  title: "Источник",
                  description: "Партнер Aligo.ru",
               },
            ],
         },
         {
            price_title: "1 400 000 ₽ (10 января 2021)",
            price_stats: [
               {
                  title: "Пробег",
                  description: "60 000 км",
               },
               {
                  title: "Регион",
                  description: "Ростовская обл., Ростов-на-Дону",
               },
               {
                  title: "Источник",
                  description: "Партнер Aligo.ru",
               },
            ],
         },
      ],
   },
   {
      id: "pts-owners",
      title: "Владельцев из ПТС",
      description: "Сведения о периодах владения предоставляются ГИБДД и актуальны только на момент покупки отчета.",
      date: "10 января 2025",
      params: [
         { title: "2 владелец (среди них юр. лицо) по данным ГИБДД", description: null, status: 2 }
      ],
      owners: [
         {
            type: "Юридическое лицо",
            date: "10 января 2021 — 26 декабря 2022 (1 год 2 месяца)",
            events: [
               { date: "10 января 2025", event: "Первичная регистрация", region: "г. Ростов-на-Дону" },
               { date: "12 января 2025", event: "Внесение изменений в регистрационные данные: В связи с получением ГРЗ", region: "г. Ростов-на-Дону" },
               { date: "15 января 2025", event: "Внесение изменений в регистрационные данные: В связи с получением ГРЗ", region: "г. Ростов-на-Дону" },
            ]
         },
         {
            type: "Физическое лицо",
            date: "10 января 2021 — 26 декабря 2022 (1 год 2 месяца)",
            events: [
               { date: "10 января 2025", event: "Первичная регистрация", region: "г. Ростов-на-Дону" },
               { date: "12 января 2025", event: "Внесение изменений в регистрационные данные: В связи с получением ГРЗ", region: "г. Ростов-на-Дону" },
               { date: "15 января 2025", event: "Внесение изменений в регистрационные данные: В связи с получением ГРЗ", region: "г. Ростов-на-Дону" },
            ]
         },
      ]
   },
   {
      id: "taxi-work",
      title: "Работа в такси",
      description: null,
      date: "10 января 2025",
      params: [
         { title: "Автомобиль не регистрировался для работы в такси", description: "Проверили VIN по федеральному и региональным транспортным департаментам.", status: 1 },
      ]
   },
   {
      id: "mileage-history",
      title: "История пробегов",
      description: null,
      date: "10 января 2025",
      params: [
         { title: "Скручивание пробега", description: "Обнаружены возможные манипуляции с пробегом", status: 3 },
         { title: "Разница пробега", description: "Несоответствие данных ТО и заявленного пробега", status: 2 }
      ],
      mileageData: [
         { date: '2024-01-01', mileage: 10 },
         { date: '2024-02-01', mileage: 20 },
         { date: '2024-03-01', mileage: 35 },
         { date: '2024-04-01', mileage: 50 },
         { date: '2024-05-01', mileage: 65 },
         { date: '2024-06-01', mileage: 80 },
         { date: '2024-07-01', mileage: 100 },
         { date: '2024-08-01', mileage: 120 },
         { date: '2024-09-01', mileage: 140 },
         { date: '2024-10-01', mileage: 160 },
         { date: '2024-11-01', mileage: 180 },
         { date: '2024-12-01', mileage: 200 },
         { date: '2025-01-01', mileage: 220 }
      ],
      ownersData: [
         { name: '1', date: '2025-01-01' },
         { name: '2', date: '2025-01-19' },
         { name: '3', date: '2025-02-04' },
      ],
   },
   {
      id: "pledge-data",
      title: "Данные о залоге",
      description: null,
      date: "10 января 2025",
      params: [
         { title: "Залог не найден", description: "Информация получена из единой информационной системы нотариата (ФНП). Базы могли быть не обновлены или банки не передали информацию о залоге в ФНП, поэтому гарантированную информацию о наличии залога получите у нотариуса непосредственно перед сделкой.", status: 1 },
      ]
   },
   {
      id: "carsharing-work",
      title: "Работа в каршеринге",
      description: null,
      date: "10 января 2025",
      params: [
         { title: "Автомобиль не регистрировался для работы в каршеринге", description: null, status: 1 },
      ]
   },
   {
      id: "recall-campaigns",
      title: "Отзывные кампании",
      description: "Иногда производители отзывают свои автомобили из-за некачественной сборки или деталей и заменяют их покупателям независимо от гарантии. Данные о таких кампаниях на территории РФ предоставляются Росстандартом",
      date: "10 января 2025",
      params: [
         { title: "Отзывных кампаний не зарегистрировано", description: null, status: 1 },
      ]
   },
   {
      id: "restrictions",
      title: "Наличие ограничений",
      description: null,
      date: "10 января 2025",
      params: [
         { title: "Ограничения на регистрационные действия не обнаружены", description: "По данным с официальных источников (сайт ГИБДД)", status: 1 },
      ]
   },
   {
      id: "aligo-listing",
      title: "Размещение на Aligo",
      description: null,
      date: null,
      seller: null,
      region: null,
      price: null,
      mileage: null,
      isPublished: null,
      history: [
         {
            type: "История изменений",
            events: [
               { date: "10 января 2025", event: "30 000 км", region: "1 500 000 ₽" },
               { date: "20 января 2025", event: "Не менялся", region: "1 400 000 ₽" },
               { date: "25 января 2025", event: "Не менялся", region: "1 350 000 ₽" },
               { date: "29 января 2025", event: "40 000 км", region: "Не менялась" },
               { date: "5 февраля 2025", event: "Не менялся", region: "1 550 000 ₽" },
            ]
         },
      ]
   },
   {
      id: "insurance-policies",
      title: "Страховые полисы",
      description: "Данные предоставляются Российским Союзом Автостраховщиков",
      date: "10 января 2025",
      icon: docIcon,
      price_history: [
         {
            price_title: "ОСАГО от 5 мая 2021",
            price_stats: [
               {
                  title: "Регион",
                  description: `Ростовская обл., Ростов-на-Дону`,
               },
               {
                  title: "Страховая компания",
                  description: `АО "АльфаСтрахование"`,
               },
               {
                  title: "Серия и номер",
                  description: "ТТТ 7023506819",
               },
               {
                  title: "Статус",
                  description: "Срок страхования истёк",
               },
            ],
         },
         {
            price_title: "ОСАГО от 5 мая 2021",
            price_stats: [
               {
                  title: "Регион",
                  description: `Ростовская обл., Ростов-на-Дону`,
               },
               {
                  title: "Страховая компания",
                  description: `АО "АльфаСтрахование"`,
               },
               {
                  title: "Серия и номер",
                  description: "ТТТ 7023506819",
               },
               {
                  title: "Статус",
                  description: "Срок страхования истёк",
               },
            ],
         },
         {
            price_title: "ОСАГО от 5 мая 2021",
            price_stats: [
               {
                  title: "Регион",
                  description: `Ростовская обл., Ростов-на-Дону`,
               },
               {
                  title: "Страховая компания",
                  description: `АО "АльфаСтрахование"`,
               },
               {
                  title: "Серия и номер",
                  description: "ТТТ 7023506819",
               },
               {
                  title: "Статус",
                  description: "Срок страхования истёк",
               },
            ],
         },
      ],
   },
   {
      id: "wanted-status",
      title: "Нахождение в розыске",
      description: null,
      date: "10 января 2025",
      params: [
         { title: "Сведения о нахождении в розыске не обнаружены", description: "По данным с официальных источников (сайт ГИБДД)", status: 1 },
      ]
   },
   {
      id: "accidents",
      title: "Участие в ДТП",
      description: "Данные об авариях хранятся и предоставляются ГИБДД",
      date: "10 января 2025",
      accidents: [
         {
            date: "1 декабря",
            details: [
               {
                  date: "1 декабря 2025",
                  location: "Ростов-на-Дону",
                  accidentType: "Столкновение",
                  damages: [
                     { part: "Переднее правое крыло", description: "Царапина/Скол, легкие повреждения переднего правого крыла или колеса" },
                     { part: "Передний бампер", description: "Царапина/Скол, легкие повреждения левой части переднего бампера" },
                     { part: "Передний бампер", description: "Царапина/Скол, легкие повреждения правой части переднего бампера" },
                  ],
                  otherParticipants: [
                     {
                        name: "Skoda Octavia",
                        damages: [
                           { part: "Переднее правое крыло", description: "Царапина/Скол, легкие повреждения переднего правого крыла или колеса" },
                           { part: "Передний бампер", description: "Царапина/Скол, легкие повреждения левой части переднего бампера" },
                        ]
                     },
                     {
                        name: "Nissan Teana",
                        damages: [
                           { part: "Переднее правое крыло", description: "Царапина/Скол, легкие повреждения переднего правого крыла или колеса" },
                           { part: "Передний бампер", description: "Царапина/Скол, легкие повреждения правой части переднего бампера" },
                        ]
                     },
                  ],
               }
            ]
         }
      ]
   },
   {
      id: "fines",
      title: "Штрафы",
      description: "Определяются по СТС через базу данных ГИБДД",
      date: "10 января 2025",
      icon: fineIcon,
      price_history: [
         {
            price_title: "1 500 ₽ от 15 марта 2025",
            status: 3,
            price_stats: [
               {
                  title: "Регион",
                  description: `Ростовская обл., Ростов-на-Дону`,
               },
               {
                  title: "Причина",
                  description: `Пользование водителем во время движения транспортного средства телефоном, не оборудованным техническим устройством, позволяющим вести переговоры без использования рук`,
               },
               {
                  title: "Кем выдан",
                  description: "ЦАФАП ОДД Госавтоинспекции ГУ МВД России по г. Ростову-на-Дону",
               },
               {
                  title: "УИН",
                  description: "18810577241133385601",
               },
            ],
         },
         {
            price_title: "1 500 ₽ от 15 марта 2025",
            status: 1,
            price_stats: [
               {
                  title: "Регион",
                  description: `Ростовская обл., Ростов-на-Дону`,
               },
               {
                  title: "Причина",
                  description: `Пользование водителем во время движения транспортного средства телефоном, не оборудованным техническим устройством, позволяющим вести переговоры без использования рук`,
               },
               {
                  title: "Кем выдан",
                  description: "ЦАФАП ОДД Госавтоинспекции ГУ МВД России по г. Ростову-на-Дону",
               },
               {
                  title: "УИН",
                  description: "18810577241133385601",
               },
            ],
         },
      ],
   },
   {
      id: "auctions",
      title: "Участие в аукционах",
      description: null,
      date: "10 января 2025",
      params: [
         { title: "Автомобиль не продавался на аукционах битых автомобилей", description: "По базе крупнейшего онлайн-аукциона битых автомобилей с тотальным ущербом", status: 1 },
         { title: "Автомобиль не участвовал в иностранных аукционах битых автомобилей", description: "По данным крупнейших зарубежных онлайн-аукционов битых автомобилей с тотальным ущербом", status: 1 }
      ]
   },
   {
      id: "use-history",
      title: "История эксплуатации",
      description: null,
      date: "10 января 2025",
      timelineBlocks: [
         {
            color: '#EEF9FF',
            events: [
               {
                  date: '2021, Россия',
                  description: 'Выпуск автомобиля',
                  image: 'car',
                  region: 'Ростовская обл., Ростов-на-Дону',
               },
            ]
         },
         {
            color: '#EEF9FF',
            events: [
               {
                  date: '2021, Россия',
                  description: 'Размещение объявления на Aligo.ru',
                  image: 'post',
                  region: 'Ростовская обл., Ростов-на-Дону',
                  details: [
                     { key: 'Пробег', value: '16 000 км' },
                     { key: 'Продавец', value: 'Частное лицо' },
                     { key: 'Цена', value: '1 630 000 ₽' }
                  ],
                  button: 'Подробнее'
               },
            ]
         },
         {
            color: '#EEF9FF',
            events: [
               {
                  date: '10 января 2021 — 26 декабря 2022 (1 год 2 месяца)',
                  description: 'Владелец 1',
                  image: 'owner',
                  region: 'Ростовская обл., Ростов-на-Дону',
               },
            ]
         },
         {
            color: '#EEF9FF',
            events: [
               {
                  date: '20 января 2021',
                  description: 'Столкновение, 2 участника',
                  image: 'crash',
                  region: 'Ростовская обл., Ростов-на-Дону',
                  accidents: [
                     {
                        date: "1 декабря",
                        details: [
                           {
                              date: "1 декабря 2025",
                              location: "Ростов-на-Дону",
                              damages: [
                                 { part: "Переднее правое крыло", description: "Царапина/Скол, легкие повреждения переднего правого крыла или колеса" },
                                 { part: "Передний бампер", description: "Царапина/Скол, легкие повреждения левой части переднего бампера" },
                                 { part: "Передний бампер", description: "Царапина/Скол, легкие повреждения правой части переднего бампера" },
                              ],
                              otherParticipants: [
                                 {
                                    name: "Skoda Octavia",
                                    damages: [
                                       { part: "Переднее правое крыло", description: "Царапина/Скол, легкие повреждения переднего правого крыла или колеса" },
                                       { part: "Передний бампер", description: "Царапина/Скол, легкие повреждения левой части переднего бампера" },
                                    ]
                                 },
                              ],
                           }
                        ]
                     }
                  ]
               },
               {
                  date: '25 января 2021',
                  description: 'Расчёт стоимости ремонта',
                  region: 'Ростовская обл., Ростов-на-Дону',
                  details: [
                     { key: 'Пробег', value: '6 000 км' },
                     { key: 'Общая стоимость', value: '300 000 – 400 000 ₽' },
                     { key: 'Тотальный ущерб', value: 'нет' }
                  ],
                  button: 'Подробнее'
               },
            ]
         },
         {
            color: '#E5FFF0',
            events: [
               {
                  date: '10 января 2022',
                  description: 'Владелец 2',
                  image: 'owner',
                  region: 'Ростовская обл., Ростов-на-Дону',
               },
               {
                  date: '5 мая 2022',
                  description: 'Полис ОСАГО',
                  region: 'Ростовская обл., Ростов-на-Дону',
                  details: [
                     { key: 'Регион', value: 'Ростовская обл., Ростов-на-Дону' },
                     { key: 'Страховая компания', value: 'АО "АльфаСтрахование"' },
                     { key: 'Серия и номер', value: 'ТТТ 7023506819' }
                  ],
               },
               {
                  date: '15 марта 2022',
                  description: 'Штраф 1 500 ₽',
                  details: [
                     { key: 'Регион', value: 'Ростовская обл., Ростов-на-Дону' },
                     { key: 'Причина', value: 'Пользование водителем во время движения транспортного средства телефоном, не оборудованным техническим устройством, позволяющим вести переговоры без использования рук' },
                     { key: 'Кем выдан', value: 'ЦАФАП ОДД Госавтоинспекции ГУ МВД России по г. Ростову-на-Дону' },
                     { key: 'УИН', value: '18810577241133385601' }
                  ],
               },
               {
                  date: '17 марта 2021',
                  description: 'Расчёт стоимости ремонта',
                  region: 'Ростовская обл., Ростов-на-Дону',
                  details: [
                     { key: 'Пробег', value: '6 000 км' },
                     { key: 'Общая стоимость', value: '100 000 – 130 000 ₽' },
                     { key: 'Тотальный ущерб:', value: 'нет' }
                  ],
                  button: 'Подробнее'
               },
            ]
         },
         {
            color: '#E5FFF0',
            events: [
               {
                  date: '28 марта 2021',
                  description: 'Размещение объявления на Aligo.ru',
                  image: 'post',
                  region: 'Ростовская обл., Ростов-на-Дону',
                  details: [
                     { key: 'Пробег', value: '16 000 км' },
                     { key: 'Продавец', value: 'Частное лицо' },
                     { key: 'Цена', value: '1 630 000 ₽' }
                  ],
                  button: 'Смотреть объявление'
               },
            ]
         },
         {
            color: '#EFE9FF',
            events: [
               {
                  date: '10 января 2021 — 26 декабря 2022 (1 год 2 месяца)',
                  description: 'Владелец 3',
                  image: 'owner',
                  region: 'Ростовская обл., Ростов-на-Дону',
               },
               {
                  date: '28 марта 2021',
                  description: 'Изменение пробега в объявлении на Aligo.ru',
                  region: 'Ростовская обл., Ростов-на-Дону',
                  details: [
                     { key: 'Пробег', value: '67 000 км' },
                     { key: 'Продавец', value: 'Частное лицо' },
                  ],
                  button: 'Смотреть объявление'
               },
               {
                  date: '28 марта 2021',
                  description: 'Оценка стоимости',
                  region: 'Ростовская обл., Ростов-на-Дону',
                  details: [
                     { key: 'Пробег', value: '67 000 км' },
                     { key: 'Источник', value: 'Партнеры' },
                  ],
               },
               {
                  date: '28 марта 2021',
                  description: 'Изменение цены в объявлении на Aligo.ru',
                  region: 'Ростовская обл., Ростов-на-Дону',
                  details: [
                     { key: 'Пробег', value: '67 000 км' },
                     { key: 'Продавец', value: 'Частное лицо' },
                  ],
                  button: 'Смотреть объявление'
               },
            ]
         },
         {
            color: '#EFE9FF',
            events: [
               {
                  date: '10 января 2021 — 26 декабря 2022 (1 год 2 месяца)',
                  description: 'Столкновение, 3 участника',
                  image: 'crash',
                  region: 'Ростовская обл., Ростов-на-Дону',
                  accidents: [
                     {
                        date: "1 декабря",
                        details: [
                           {
                              date: "1 декабря 2025",
                              location: "Ростов-на-Дону",
                              damages: [
                                 { part: "Переднее правое крыло", description: "Царапина/Скол, легкие повреждения переднего правого крыла или колеса" },
                                 { part: "Передний бампер", description: "Царапина/Скол, легкие повреждения левой части переднего бампера" },
                                 { part: "Передний бампер", description: "Царапина/Скол, легкие повреждения правой части переднего бампера" },
                              ],
                              otherParticipants: [
                                 {
                                    name: "Skoda Octavia",
                                    damages: [
                                       { part: "Переднее правое крыло", description: "Царапина/Скол, легкие повреждения переднего правого крыла или колеса" },
                                       { part: "Передний бампер", description: "Царапина/Скол, легкие повреждения левой части переднего бампера" },
                                    ]
                                 },
                                 {
                                    name: "Nissan Teana",
                                    damages: [
                                       { part: "Переднее правое крыло", description: "Царапина/Скол, легкие повреждения переднего правого крыла или колеса" },
                                       { part: "Передний бампер", description: "Царапина/Скол, легкие повреждения правой части переднего бампера" },
                                    ]
                                 },
                              ],
                           }
                        ]
                     }
                  ]
               },
               {
                  date: '28 марта 2021',
                  description: 'Расчёт стоимости ремонта',
                  region: 'Ростовская обл., Ростов-на-Дону',
                  details: [
                     { key: 'Пробег', value: '6 000 км' },
                     { key: 'Общая стоимость', value: '100 000 – 130 000 ₽' },
                     { key: 'Тотальный ущерб:', value: 'нет' }
                  ],
                  button: 'Подробнее'
               },
               {
                  date: '28 марта 2021',
                  description: 'Оценка стоимости',
                  region: 'Ростовская обл., Ростов-на-Дону',
                  details: [
                     { key: 'Пробег', value: '6 000 км' },
                     { key: 'Источник', value: 'Партнеры' },
                  ],
               },
               {
                  date: '28 марта 2021',
                  description: 'Полис ОСАГО',
                  region: 'Ростовская обл., Ростов-на-Дону',
                  details: [
                     { key: 'Регион', value: 'Ростовская обл., Ростов-на-Дону' },
                     { key: 'Страховая компания', value: 'АО "АльфаСтрахование"' },
                     { key: 'Серия и номер', value: 'ТТТ 7023506819' }
                  ],
               },
               {
                  date: '28 марта 2021',
                  description: 'Расчёт стоимости ремонта',
                  region: 'Ростовская обл., Ростов-на-Дону',
                  details: [
                     { key: 'Пробег', value: '6 000 км' },
                     { key: 'Общая стоимость', value: '100 000 – 130 000 ₽' },
                     { key: 'Тотальный ущерб:', value: 'нет' }
                  ],
                  button: 'Подробнее'
               },
            ]
         },
         {
            color: '#FEEAFF',
            events: [
               {
                  date: '12 июля 2023 — 12 декабря 2023 (6 месяцев)',
                  description: 'Владелец 4',
                  image: 'owner',
                  region: 'Ростовская обл., Ростов-на-Дону',
               },
               {
                  date: '28 марта 2021',
                  description: 'Оценка стоимости',
                  region: 'Ростовская обл., Ростов-на-Дону',
                  details: [
                     { key: 'Пробег', value: '6 000 км' },
                     { key: 'Источник', value: 'Партнеры' },
                  ],
               },
            ]
         },
         {
            color: '#FEEAFF',
            events: [
               {
                  date: '8 декабря 2023',
                  description: 'Размещение объявления на Aligo.ru',
                  image: 'post',
                  region: 'Ростовская обл., Ростов-на-Дону',
                  details: [
                     { key: 'Пробег', value: '16 000 км' },
                     { key: 'Продавец', value: 'Частное лицо' },
                     { key: 'Цена', value: '1 630 000 ₽' }
                  ],
                  button: 'Подробнее'
               },
            ]
         },
         {
            color: '#EEEEEE',
            events: [
               {
                  date: '12 декабря 2023 — по сей день (6 месяцев)',
                  description: 'Владелец 4',
                  image: 'owner',
                  region: 'Ростовская обл., Ростов-на-Дону',
               },
            ]
         },
         {
            color: '#EEEEEE',
            events: [
               {
                  date: '8 декабря 2023',
                  description: 'Размещение объявления на Aligo.ru',
                  image: 'post',
                  region: 'Ростовская обл., Ростов-на-Дону',
                  details: [
                     { key: 'Пробег', value: '16 000 км' },
                     { key: 'Продавец', value: 'Частное лицо' },
                     { key: 'Цена', value: '1 630 000 ₽' }
                  ],
                  button: 'Подробнее'
               },
            ]
         },
      ]
   },
   {
      id: "repair-cost",
      title: "Расчёт стоимости ремонта",
      description: "Стоимость ремонта оценивают страховые компании при наступлении страхового случая. Разные компании могут рассчитывать стоимость ремонта, а наличие расчёта не означает, что автомобиль ремонтировали. Данные предоставляются Audatex.",
      date: "10 января 2025",
      updates: [
         {
            date: "10 января 2025",
            details: [
               {
                  date: "1 декабря 2025",
                  price_range: "300 000 — 400 000 ₽",
                  breakdown: [
                     { category: "Покраска", cost: "10 000 – 20 000 ₽" },
                     { category: "Работы", cost: "10 000 – 20 000 ₽" },
                     { category: "Запчасти", cost: "200 000 – 300 000 ₽" },
                  ],
                  repairs: {
                     partial: [
                        "Лонжерон в арке колеса передний правый отремонтировать",
                        "Крепление нижнее правое фары ремонтировать",
                        "Элемент жесткости передний правый внутренний отремонтировать",
                        "Поперечный в модуль потребовать ремонтировать",
                     ],
                     painting: [
                        "Лонжерон в арке колеса передний правый окраска поверхности",
                        "Облицовка бампера переднего нанесение лака распылением",
                        "Крыло переднее правое окраска новой детали",
                     ],
                     replacement: [
                        "Облицовка бампер передний",
                        "Решетка нижняя правая бампера переднего",
                        "Опора правого бампера передняя",
                        "Гаситель удара передний",
                        "Крыло переднее правое",
                        "Фара правая",
                     ],
                     additional: [
                        "Крыло переднее правое антикоррозионная защита",
                        "Скрытые полости законсервировать дополнительная работа",
                     ],
                  },
               },
               {
                  date: "1 декабря 2025",
                  price_range: "300 000 — 400 000 ₽",
                  breakdown: [
                     { category: "Работы", cost: "до 10 000 ₽" },
                     { category: "Запчасти", cost: "300 000 – 400 000 ₽" },
                  ],
                  repairs: {
                     replacement: [
                        "Облицовка бампер передний",
                        "Решетка нижняя правая бампера переднего",
                        "Опора правого бампера передняя",
                        "Гаситель удара передний",
                        "Крыло переднее правое",
                        "Фара правая",
                     ],
                  },
               },
            ],
         },
      ],
   },
   { id: "vin-options", title: "Опции по VIN", description: "В соответствии с заводской документации найденой по VIN", status: 3, date: "10 января 2025" },
   {
      id: "reviews-ratings",
      title: "Отзывы и рейтинги",
      description: "Определяются по СТС через базу данных ГИБДД",
      date: "10 января 2025",
      params: [
         {
            title: "Общая оценка",
            description: "4,8 из 5 по 22 отзывам",
            status: 4
         },
         {
            title: "Рейтинг похожих автомобилей",
            description: "80-85 из 100 по 12 отзывам",
            status: 4
         }
      ]
   },
   {
      id: "characteristics",
      title: "Характеристики",
      characteristics: [
         {
            title: "Размеры",
            details: [
               { key: "Фото", value: carplaceholderImage },
               { key: "Длина", value: "4939 мм" },
               { key: "Ширина", value: "1850 мм" },
               { key: "Высота", value: "1480 мм" },
               { key: "Колесная база", value: "2939 мм" },
               { key: "Ширина передней колеи", value: "1604 мм" },
               { key: "Ширина задней колеи", value: "1604 мм" },
               { key: "Размер колес", value: "245/45/R18" },
               { key: "Сверловка", value: "DIA66.6 5x112 мм" }
            ]
         },
         {
            title: "Общая информация",
            details: [
               { key: "Страна марки", value: "Германия" },
               { key: "Класс автомобиля", value: "E" },
               { key: "Количество дверей", value: "4" },
               { key: "Количество мест", value: "5" },
               { key: "Расположение руля", value: "Левый" }
            ]
         },
         {
            title: "Объем и масса",
            details: [
               { key: "Объем багажника (мин/макс)", value: "540 л" },
               { key: "Объем топливного бака", value: "50 л" },
               { key: "Снаряженная масса", value: "1920 кг" },
               { key: "Полная масса", value: "2580 кг" }
            ]
         },
         {
            title: "Трансмиссия",
            details: [
               { key: "Коробка передач", value: "Автомат" },
               { key: "Количество передач", value: "9" },
               { key: "Тип привода", value: "Полный" }
            ]
         },
         {
            title: "Подвеска и тормоза",
            details: [
               { key: "Тип передней подвески", value: "Независимая, пружинная" },
               { key: "Тип задней подвески", value: "Независимая, пружинная" },
               { key: "Передние тормоза", value: "Дисковые вентилируемые" },
               { key: "Задние тормоза", value: "Дисковые вентилируемые" }
            ]
         },
         {
            title: "Эксплуатационные показатели",
            details: [
               { key: "Максимальная скорость", value: "250 км/ч" },
               { key: "Разгон до 100 км/ч", value: "5.9 с" },
               { key: "Расход топлива (город/трасса/смешанный)", value: "8.4/5.2/6.4 л/100 км" },
               { key: "Марка топлива", value: "ДТ" },
               { key: "Экологический класс", value: "Euro 6" },
               { key: "Выбросы CO2", value: "168 г/км" }
            ]
         },
         {
            title: "Двигатель",
            details: [
               { key: "Тип двигателя", value: "Дизельный" },
               { key: "Расположение двигателя", value: "Переднее, продольное" },
               { key: "Объем двигателя", value: "2925 см³" },
               { key: "Тип наддува", value: "Турбонаддув" },
               { key: "Максимальная мощность", value: "249 л.с. (183 кВт) при 4600 об/мин" },
               { key: "Максимальный крутящий момент", value: "600 Н·м при 3000 об/мин" },
               { key: "Расположение цилиндров", value: "Рядное" },
               { key: "Количество цилиндров", value: "6" },
               { key: "Число клапанов на цилиндр", value: "4" },
               { key: "Система питания двигателя", value: "Common Rail (Дизель)" },
               { key: "Степень сжатия", value: "15.5" },
               { key: "Диаметр цилиндра и ход поршня", value: "82.0x92.4 мм" },
               { key: "Модель двигателя", value: "OM656" },
               { key: "ГРМ", value: "DOHC" }
            ]
         }
      ]
   }
]);
</script>

<style lang="scss" scoped>
.loading-container {
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   z-index: 5;

   @media (max-width: 768px) {
      padding: 24px;
   }
}

.loader {
   border: 6px solid #f3f3f3;
   border-top: 6px solid #144DF8;
   border-radius: 50%;
   width: 50px;
   height: 50px;
   animation: spin 2s linear infinite;
}

@keyframes spin {
   0% {
      transform: rotate(0deg);
   }

   100% {
      transform: rotate(360deg);
   }
}

.loading-text {
   text-align: center;
   color: #323232;
   margin-top: 32px;
   font-size: 16px;
}

.loading-text p {
   margin-bottom: 16px;
   font-weight: 700;
   font-size: 20px;
   line-height: 24px;

}

.loading-text span {
   font-size: 14px;
   line-height: 18px;
}

.report-page {
   margin: 0 auto;
   margin-top: 134px;
   min-height: calc(100vh - 134px);
   min-height: calc(100dvh - 134px);
   width: 100%;

   @media (max-width: 768px) {
      margin-top: 90px;
   }

   &__info {
      display: grid;
      max-width: 1312px;
      grid-template-columns: 1fr 1fr;
      gap: 134px;
      max-height: 480px;
      margin: 0 auto;
      padding: 0 16px;

      @media (max-width: 1024px) {
         display: flex;
         gap: 24px;
         flex-direction: column;
         max-height: fit-content;
      }
   }

   &__block {
      display: flex;
      flex-direction: column;
      gap: 24px;
   }

   &__title {
      font-size: 32px;
      line-height: 36px;
      color: #323232;
      font-weight: 700;
      margin: 0;
      margin-bottom: 12px;
   }

   &__text {
      display: flex;
      gap: 8px;
      font-size: 14px;
      line-height: 18px;
      margin-bottom: 12px;
      color: #323232
   }

   &__label {
      color: #787878;
   }

   &__history {
      font-weight: bold;
      margin-top: 10px;
   }

   &__button {
      margin-top: 10px;
      padding: 10px 20px;
      background-color: #3366ff;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.3s ease;

      &:hover {
         background-color: #254eda;
      }
   }

   &__slider {
      height: 400px;
      max-width: 640px;
      width: 100%;

      @media (max-width: 1024px) {
         max-width: 100%;
      }

      @media (max-width: 768px) {
         height: 360px;
         max-width: 100%;
      }
   }

   &__sections {
      max-width: 1312px;
      margin: 0 auto;
      padding: 0 16px;
   }
}
</style>