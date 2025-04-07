import { format } from 'date-fns';
import historyIcon from '@/assets/icons/icon-history.svg'
import updateIcon from '@/assets/icons/update-icon.svg'
import docIcon from '@/assets/icons/doc-icon.svg'
import fineIcon from '@/assets/icons/fine-icon.svg'
import testicon from '@/assets/icons/test-icon.svg'
import { ru } from 'date-fns/locale';

const damageCodeMap = {
   "114": "Переднее правое крыло",
   "115": "Передний бампер (левая часть)",
   "124": "Передний бампер (правая часть)",
   "119": "Задний бампер",
   "120": "Левое заднее крыло",
};

function getStatusFromColor(color) {
   switch (color) {
      case 'green':
         return 1;
      case 'gray':
         return 2;
      case 'red':
         return 3;
      default:
         return 0;
   }
}

export function transformAccidentsData(infoAccident) {
   if (!infoAccident || !infoAccident.value) return null;

   const accidents = infoAccident.value.map(acc => {
      const dateFull = format(new Date(acc.crashDate), 'd MMMM yyyy', { locale: ru });
      const dateShort = format(new Date(acc.crashDate), 'd MMMM', { locale: ru });

      return {
         date: dateShort,
         details: [
            {
               date: dateFull,
               location: acc.region,
               accidentType: acc.accidentType,
               damages: acc.damagePoints.map(code => ({
                  part: damageCodeMap[code] || `Часть с кодом ${code}`,
                  description: `Повреждение части с кодом ${code}`
               })),
               otherParticipants: []
            }
         ]
      };
   });

   return {
      id: 'accidents',
      title: infoAccident.title || 'Участие в ДТП',
      description: infoAccident.info_description || '',
      date: format(new Date(infoAccident.checkDateTime), 'd MMMM yyyy', { locale: ru }),
      accidents
   };
}


export function transformAuctionData(infoAuction) {
   if (!infoAuction) return null;

   return {
      id: 'auctions',
      title: infoAuction.title || 'Участие в аукционах',
      description: null,
      date: format(new Date(infoAuction.checkDateTime), 'd MMMM yyyy', { locale: ru }),
      params: [
         {
            title: infoAuction.info || 'Нет данных',
            description: infoAuction.info_description || '',
            status: infoAuction.color_baige === 'green' ? 1 : infoAuction.color_baige === 'gray' ? 2 : 3
         },
         {
            title: infoAuction.info_2 || 'Нет данных',
            description: infoAuction.info_description_2 || '',
            status: getStatusFromColor(infoAuction.color_baige)
         }
      ]
   };
}

export function transformOwnersData(infoOwners) {
   if (!infoOwners || !Array.isArray(infoOwners.value)) return null;

   const owners = infoOwners.value.map((ownerData, index) => {
      const start = ownerData.startDate ? format(new Date(ownerData.startDate), 'd MMMM yyyy', { locale: ru }) : '';
      const end = ownerData.endDate ? format(new Date(ownerData.endDate), 'd MMMM yyyy', { locale: ru }) : 'н.в.';
      const period = ownerData.period_ownership || '';

      return {
         type: ownerData.title || 'нет данных',
         date: `${start} — ${end}${period ? ` (${period})` : ''}`,
         events: []
      };
   });

   const hasLegalEntity = infoOwners.value.some(owner => owner.is_natural_person === 0);
   const count = infoOwners.count_owners || owners.length;

   return {
      id: 'pts-owners',
      title: infoOwners.title || 'Владельцев из ПТС',
      description: infoOwners.description || null,
      date: format(new Date(infoOwners.checkDateTime), 'd MMMM yyyy', { locale: ru }),
      params: [
         {
            title: `${count} владелец${count > 1 ? 'а' : ''}${hasLegalEntity ? ' (среди них юр. лицо)' : ''} по данным ГИБДД`,
            description: null,
            status: getStatusFromColor(infoOwners.color_baige),
         }
      ],
      owners
   };
}

export function transformWantedData(infoHijacked) {
   return {
      id: "wanted-status",
      title: infoHijacked.title || "Нахождение в розыске",
      description: null,
      date: format(new Date(infoHijacked.checkDateTime), 'd MMMM yyyy', { locale: ru }),
      params: [
         {
            title: infoHijacked.info || 'Нет данных',
            description: infoHijacked.info_description || '',
            status: getStatusFromColor(infoHijacked.color_baige),
         },
      ],
   };
}

export function transformLeasingData(infoLeasing) {
   return {
      id: "leasing-contracts",
      title: infoLeasing.title || "Договоры лизинга",
      description: infoLeasing.info_description || null,
      date: format(new Date(infoLeasing.checkDateTime), 'd MMMM yyyy', { locale: ru }),
      params: [
         {
            title: infoLeasing.info || 'Нет данных',
            description: "По данным Единого федерального реестра сведений о фактах деятельности юридических лиц.",
            status: getStatusFromColor(infoLeasing.color_baige),
         },
      ],
   };
}

function detectRollback(mileageArray) {
   for (let i = 1; i < mileageArray.length; i++) {
      if (mileageArray[i].mileage < mileageArray[i - 1].mileage) {
         return true;
      }
   }
   return false;
}

function detectMismatch(mileageArray) {
   for (let i = 1; i < mileageArray.length; i++) {
      const diff = mileageArray[i].mileage - mileageArray[i - 1].mileage;
      const dateDiff = new Date(mileageArray[i].date) - new Date(mileageArray[i - 1].date);
      const months = dateDiff / (1000 * 60 * 60 * 24 * 30);

      if (months > 0 && diff / months > 10000) {
         return true;
      }
   }
   return false;
}

export function transformMileageData(infoMileage, ownersInfo) {
   const rawData = infoMileage.value || [];

   const sortedMileage = rawData
      .slice()
      .sort((a, b) => new Date(a.date) - new Date(b.date));

   const rollbackDetected = detectRollback(sortedMileage);
   const mismatchDetected = detectMismatch(sortedMileage);

   const ownersData = ownersInfo.map((owner, index) => ({
      name: (index + 1).toString(),
      date: format(new Date(owner.startDate), 'yyyy-MM-dd'),
   }));

   return {
      id: "mileage-history",
      title: infoMileage.title || "История пробегов",
      description: null,
      date: format(new Date(infoMileage.checkDateTime), 'd MMMM yyyy', { locale: ru }),
      params: [
         {
            title: rollbackDetected
               ? "Скручивание пробега"
               : "Манипуляции с пробегом не обнаружены",
            description: rollbackDetected
               ? "Обнаружены возможные манипуляции с пробегом"
               : "Скручивание пробега не зафиксировано на основе данных ТО",
            status: rollbackDetected ? 3 : 1
         },
      ],
      mileageData: sortedMileage.map(item => ({
         date: format(new Date(item.date), 'yyyy-MM-dd'),
         mileage: item.mileage
      })),
      ownersData,
   };
}

export function transformOsagoData(infoOsago) {
   return {
      id: "insurance-policies",
      title: infoOsago.title,
      description: infoOsago.description,
      date: new Date(infoOsago.checkDateTime).toLocaleDateString("ru-RU", { year: 'numeric', month: 'long', day: 'numeric' }),
      icon: docIcon,
      price_history: infoOsago.value.map(policy => ({
         price_title: `ОСАГО от ${new Date(policy.insuranceDate).toLocaleDateString("ru-RU", { year: 'numeric', month: 'long', day: 'numeric' })}`,
         price_stats: [
            {
               title: "Регион",
               description: policy.carRegion || "Не указан",
            },
            {
               title: "Страховая компания",
               description: policy.insurerName || "Не указана",
            },
            {
               title: "Серия и номер",
               description: policy.insuranceNumber || "Не указан",
            },
            {
               title: "Статус",
               description: policy.insuranceStatus || "Не известно",
            },
            {
               title: "Автомобиль",
               description: policy.markModel || "Не указан",
            },
            {
               title: "Владелец",
               description: policy.owner || "Не указан",
            },
            {
               title: "Стоимость",
               description: policy.cost ? `${policy.cost} ₽` : "Не указана",
            },
            {
               title: "КБМ",
               description: policy.kbm || "Не указан",
            },
            {
               title: "Период действия",
               description: policy.insuranceDate ? policy.insuranceDate : "Не указан",
            },
            {
               title: "Ограничения",
               description: policy.restrictions || "Нет ограничений",
            },
         ],
      })),
   };
}

export function transformPledgeData(infoPledge) {
   return {
      id: "pledge-data",
      title: infoPledge.title,
      description: infoPledge.info_description || null,
      date: new Date(infoPledge.checkDateTime).toLocaleDateString("ru-RU", { year: 'numeric', month: 'long', day: 'numeric' }),
      params: [
         {
            title: infoPledge.value.inPledge ? "Залог найден" : "Залог не найден",
            description: infoPledge.info_description || null,
            status: getStatusFromColor(infoPledge.color_baige),
         }
      ]
   };
}

export function transformPtsData(infoPts) {
   return {
      id: "pts-data",
      title: infoPts.title || "Данные из ПТС",
      description: infoPts.description || "Информация из ПТС транспортного средства",
      date: new Date(infoPts.checkDateTime).toLocaleDateString("ru-RU", { year: 'numeric', month: 'long', day: 'numeric' }),
      stats: [
         {
            title: "Марка и модель",
            description: infoPts.value.model || "Не указано",
         },
         {
            title: "Объём двигателя",
            description: infoPts.value.engineVolume ? `${infoPts.value.engineVolume} л.` : "Не указан",
         },
         {
            title: "Номер и серия ПТС",
            description: infoPts.value.engineNumber || "Не указан",
         },
         {
            title: "Госномер",
            description: infoPts.value.vin || "Не указан",
         },
         {
            title: "Мощность двигателя",
            description: infoPts.value.powerHp ? `${infoPts.value.powerHp} л.с.` : "Не указано",
         },
         {
            title: "Категория ТС",
            description: infoPts.value.category || "Не указана",
         },
         {
            title: "Цвет",
            description: infoPts.value.color || "Не указан",
         },
         {
            title: "VIN",
            description: infoPts.value.vin || "Не указан",
         },
         {
            title: "Год выпуска",
            description: infoPts.value.year || "Не указан",
         },
         {
            title: "Тип ТС",
            description: infoPts.value.type || "Не указан",
         },
      ]
   };
}

export function transformRecallCampaignsData(infoRecalledCompanies) {
   console.log(infoRecalledCompanies);
   return {
      id: "recall-campaigns",
      title: infoRecalledCompanies.title || "Отзывные кампании",
      description: infoRecalledCompanies.info_description
         || "Иногда производители отзывают свои автомобили из-за некачественной сборки или деталей и заменяют их покупателям независимо от гарантии. Данные о таких кампаниях на территории РФ предоставляются Росстандартом",
      date: new Date(infoRecalledCompanies.checkDateTime).toLocaleDateString("ru-RU", { year: 'numeric', month: 'long', day: 'numeric' }),
      params: [
         {
            title: infoRecalledCompanies.info || "Отзывных кампаний не зарегистрировано",
            description: infoRecalledCompanies.info_description || "Иногда производители отзывают свои автомобили из-за некачественной сборки или деталей и заменяют их покупателям независимо от гарантии. Данные о таких кампаниях на территории РФ предоставляются Росстандартом",
            status: getStatusFromColor(infoRecalledCompanies.color_baige),
         },
      ]
   };
}

export function transformRepairData(infoRepair) {
   console.log(infoRepair);
   return {
      id: "repair-cost",
      title: infoRepair.title || "Расчёт стоимости ремонта",
      description: infoRepair.info_description || "Стоимость ремонта оценивают страховые компании при наступлении страхового случая. Разные компании могут рассчитывать стоимость ремонта, а наличие расчёта не означает, что автомобиль ремонтировали. Данные предоставляются Audatex.",
      date: new Date(infoRepair.checkDateTime).toLocaleDateString("ru-RU", { year: 'numeric', month: 'long', day: 'numeric' }),
      updates: [
         {
            date: infoRepair.checkDateTime || "Не указана дата",
            details: [
               {
                  date: infoRepair.checkDateTime || "Не указана дата",
                  price_range: "Не указана стоимость",
                  breakdown: [],
                  repairs: {},
               },
            ],
         },
      ],
   };
}

export function transformShortReportToList(shortReport) {
   const colorToStatus = {
      green: 1,
      gray: 2,
      red: 3,
   }

   return Object.entries(shortReport).map(([key, value]) => {
      return {
         id: mapKeyToId(key),
         title: value.title,
         text: value.info,
         status: colorToStatus[value.color_baige] || 1,
      }
   })
}

function mapKeyToId(key) {
   const map = {
      info_pts: 'pts-data',
      info_leasing: 'leasing-contracts',
      info_cost: 'cost-evaluation',
      info_count_owners: 'pts-owners',
      info_taxi: 'taxi-work',
      info_mileage: 'mileage-history',
      info_pledge: 'pledge-data',
      info_carsharing: 'carsharing-work',
      info_recalled_companies: 'recall-campaigns',
      info_restriction: 'restrictions',
      info_aligo: 'aligo-listing',
      info_osago: 'insurance-policies',
      info_hijacked: 'wanted-status',
      info_accident: 'accidents',
      info_fines: 'fines',
      info_auction: 'auctions',
      info_repair: 'repair-cost',
      info_vin: 'vin-options',
   }

   return map[key] || key
}