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
   if (!infoAccident.value) {
      return {
         id: 'accidents',
         title: infoAccident.title || 'Участие в ДТП',
         description: infoAccident.description || 'Данные об авариях хранятся и предоставляются ГИБДД',
         date: format(new Date(infoAccident.checkDateTime), 'd MMMM yyyy', { locale: ru }),
         accidents: [],
         params: [
            {
               title: infoAccident.info || 'Нет данных',
               description: infoAccident.info_description || null,
               status: getStatusFromColor(infoAccident.color_baige),
            },
         ]
      };
   }

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
      description: infoAccident.description || 'Данные об авариях хранятся и предоставляются ГИБДД',
      date: format(new Date(infoAccident.checkDateTime), 'd MMMM yyyy', { locale: ru }),
      accidents,
      params: [
         {
            title: infoAccident.info || 'Нет данных',
            description: infoAccident.info_description || null,
            status: getStatusFromColor(infoAccident.color_baige),
         },
      ]
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
            description: infoAuction.info_description || null,
            status: getStatusFromColor(infoAuction.color_baige),
         },
         {
            title: infoAuction.info_2 || 'Нет данных',
            description: infoAuction.info_description_2 || null,
            status: getStatusFromColor(infoAuction.color_baige)
         }
      ]
   };
}

export function transformOwnersData(infoOwners) {
   if (!infoOwners || !Array.isArray(infoOwners.value)) return null;

   const ownersArray = [].concat(...infoOwners.value);

   const owners = ownersArray.map((ownerData, index) => {
      const start = ownerData.startDate ? format(new Date(ownerData.startDate), 'd MMMM yyyy', { locale: ru }) : '';
      const end = ownerData.endDate ? format(new Date(ownerData.endDate), 'd MMMM yyyy', { locale: ru }) : 'н.в.';
      const period = ownerData.period_ownership || '';

      return {
         type: ownerData.title || 'нет данных',
         date: `${start} — ${end}${period ? ` (${period})` : ''}`,
         events: []
      };
   });

   const hasLegalEntity = ownersArray.some(owner => owner.is_natural_person === 0);
   const count = infoOwners.count_owners || owners.length;

   return {
      id: 'pts-owners',
      title: infoOwners.title || 'Владельцев из ПТС',
      description: infoOwners.description || "Сведения о периодах владения предоставляются ГИБДД и актуальны только на момент покупки отчета.",
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
            description: infoHijacked.info_description || null,
            status: getStatusFromColor(infoHijacked.color_baige),
         },
      ],
   };
}

export function transformLeasingData(infoLeasing) {
   return {
      id: "leasing-contracts",
      title: infoLeasing.title || "Договоры лизинга",
      description: "Лизинг — долгосрочная аренда. Автомобиль мог подвергаться сильному износу, стоит обратить внимание на его состояние",
      date: format(new Date(infoLeasing.checkDateTime), 'd MMMM yyyy', { locale: ru }),
      params: [
         {
            title: infoLeasing.info || 'Нет данных',
            description: infoLeasing.info_description || null,
            status: getStatusFromColor(infoLeasing.color_baige),
         },
      ],
   };
}

export function transformMileageData(info) {
   const data = info?.value;
   console.log(data, 'wefwfwefwef')
   if (!Array.isArray(data)) {
      console.warn('transformMileageData: ожидается массив info.value, но пришло:', data);
      return {
         id: "mileage-history",
         title: info.title,
         description: null,
         date: format(new Date(info.checkDateTime), 'd MMMM yyyy', { locale: ru }),
         params: [
            {
               title: info.info,
               description: info.info_description || null,
               status: getStatusFromColor(info.color_baige),
            }
         ],
         mileageData: [],
         ownersData: [],
      };
   }

   const mileageDataMap = new Map();
   const ownersMap = new Map();

   data.forEach((item, index) => {
      const date = item.mileage.date.split(' ')[0];
      mileageDataMap.set(date, item.mileage.mileage);

      const startDate = item.owner?.startDate?.split(' ')[0];
      const key = `${startDate}`;
      if (startDate && !ownersMap.has(key)) {
         ownersMap.set(key, {
            name: `${index}`,
            date: startDate,
         });
      }

      console.log(`Processing owner ${index}:`, { startDate, key: `${startDate}` });
   });

   console.log(ownersMap)

   const mileageData = [...mileageDataMap.entries()]
      .map(([date, mileage]) => ({ date, mileage }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

   const ownersData = [...ownersMap.values()]
      .sort((a, b) => new Date(a.date) - new Date(b.date));

   const params = [];

   if (mileageData.length >= 2) {
      for (let i = 1; i < mileageData.length; i++) {
         if (mileageData[i].mileage < mileageData[i - 1].mileage) {
            params.push({
               title: "Скручивание пробега",
               description: "Обнаружены возможные манипуляции с пробегом",
               status: 3,
            });
            break;
         }
      }
   }

   if (mileageData.length > 0) {
      params.push({
         title: info.info,
         description: info.info_description || null,
         status: getStatusFromColor(info.color_baige),
      });
   }

   return {
      id: "mileage-history",
      title: info.title || "История пробегов",
      description: info.info || null,
      date: info.checkDateTime?.split(' ')[0] || null,
      color: info.color_baige || null,
      status: info.status || null,
      params,
      mileageData,
      ownersData,
   };
}

export function transformOsagoData(infoOsago) {
   return {
      id: "insurance-policies",
      title: infoOsago.title,
      description: infoOsago.description || null,
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
      description: null,
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
      description: "Проверьте  эти данные при заключении сделки, они указаны в паспорте транспортного средства. Сведения предоставляются ГИБДД.",
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
      description: infoRecalledCompanies.description
         || "Иногда производители отзывают свои автомобили из-за некачественной сборки или деталей и заменяют их покупателям независимо от гарантии. Данные о таких кампаниях на территории РФ предоставляются Росстандартом",
      date: new Date(infoRecalledCompanies.checkDateTime).toLocaleDateString("ru-RU", { year: 'numeric', month: 'long', day: 'numeric' }),
      params: [
         {
            title: infoRecalledCompanies.info || "Отзывных кампаний не зарегистрировано",
            description: infoRecalledCompanies.info_description || null,
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
      description: infoRepair.description || "Стоимость ремонта оценивают страховые компании при наступлении страхового случая. Разные компании могут рассчитывать стоимость ремонта, а наличие расчёта не означает, что автомобиль ремонтировали. Данные предоставляются Audatex.",
      date: new Date(infoRepair.checkDateTime).toLocaleDateString("ru-RU", { year: 'numeric', month: 'long', day: 'numeric' }),
      params: [
         {
            title: infoRepair.info,
            description: infoRepair.info_description,
            status: getStatusFromColor(infoRepair.color_baige),
         },
      ],
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

export function transformRestrictionData(data) {
   return {
      id: "restrictions",
      title: data.title || "Наличие ограничений",
      description: null,
      date: new Date(data.checkDateTime).toLocaleDateString("ru-RU", { year: 'numeric', month: 'long', day: 'numeric' }),
      params: [
         {
            title: data.info || null,
            description: data.info_description || null,
            status: getStatusFromColor(data.color_baige),
         },
      ],
   };
}

export function transformTaxiData(data) {
   return {
      id: "taxi",
      title: data.title || "Работа в такси",
      description: null,
      date: new Date(data.checkDateTime).toLocaleDateString("ru-RU", {
         year: "numeric",
         month: "long",
         day: "numeric",
      }),
      params: [
         {
            title: data.info || null,
            description: data.info_description || null,
            status: getStatusFromColor(data.color_baige),
         },
      ],
   };
}