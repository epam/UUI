# ScrollBars Migration Plan - Issue #2664

## Замена react-custom-scrollbars на современную альтернативу

### Текущее состояние
- [x] Анализ использования react-custom-scrollbars в кодовой базе
- [x] Определение затронутых компонентов
- [x] Оценка текущего тестового покрытия

---

## 🎯 Основные цели

- [ ] Заменить deprecated `react-custom-scrollbars-2` на современную библиотеку
- [ ] Сохранить 100% обратную совместимость API
- [ ] Исправить баг с zoom levels (#2644)
- [ ] Добавить документацию
- [ ] Расширить тестовое покрытие

---

## 📦 Затронутые компоненты

### Основные файлы для замены:
- [ ] `uui-components/src/layout/ScrollBars.tsx` - основная реализация
- [ ] `uui/components/layout/ScrollBars.tsx` - стилизованная версия
- [ ] `uui-components/src/layout/ScrollBars.module.scss` - стили базовые
- [ ] `uui/components/layout/ScrollBars.module.scss` - стили UUI

### Компоненты использующие ScrollBars:
- [ ] `VirtualList` (`uui/components/layout/VirtualList.tsx`)
- [ ] `SlateEditor` (`uui-editor/src/SlateEditor.tsx`)
- [ ] `DataTable` (`uui/components/tables/DataTable.tsx`)
- [ ] `PresetsPanel` (`uui/components/filters/PresetPanel/PresetsPanel.tsx`)
- [ ] Демо компоненты в `app/src/sandbox/`
- [ ] Next.js примеры (`next-demo/`)

### Пакеты с экспортами:
- [ ] `@epam/uui`
- [ ] `@epam/promo`
- [ ] `@epam/loveship`
- [ ] `@epam/electric`

---

## 🔄 Этапы миграции

### Этап 1: Подготовка и анализ ✅
- [x] Выбор и оценка новой библиотеки: **overlayscrollbars-react**
- [ ] Анализ API совместимости:
  - [ ] Проверка методов `getValues()`, `scrollTop()`, `scrollLeft()`
  - [ ] Сравнение с OverlayScrollbars instance API
  - [ ] Анализ ref forwarding (`osInstance()`, `getElement()`)
- [ ] Проверка поддержки RTL: встроенная поддержка ✅
- [ ] Тестирование performance: поддержка `defer` инициализации ✅
- [ ] Проверка кастомизации рендеров: через `options` объект ✅

### Этап 2: Создание адаптера
- [ ] Создание типов `ScrollbarProps` под новую библиотеку:
  - [ ] Мапинг на `OverlayScrollbarsComponent` props
  - [ ] Поддержка всех существующих UUI props
- [ ] Реализация интерфейса `ScrollbarsApi`:
  - [ ] Обертка над `osInstance()` из ref
  - [ ] Реализация `getValues()` через `instance.state()`
  - [ ] Реализация `scrollTop(value)` через `instance.elements().viewport.scrollTo()`
  - [ ] Реализация `scrollLeft(value)` аналогично
  - [ ] `container` через `getElement()` из ref
- [ ] Адаптация кастомных рендеров:
  - [ ] `renderView` - через `element` prop и wrapper div
  - [ ] Треки и thumb - через CSS кастомизацию в `options.scrollbars`
  - [ ] Альтернатива: использовать CSS переменные для стилизации

### Этап 3: UUI-специфичная логика ✅
- [x] Реализация динамических теней (`hasTopShadow`, `hasBottomShadow`)
- [x] Поддержка RTL через `getDir()`:
  - [x] Определение направления с помощью `getDir()`
  - [x] Функция `getIndent()` для корректировки отступов в RTL
  - [x] Интеграция с `renderView` для RTL-совместимых стилей
  - [x] Установка `dir` атрибута на контейнер
- [x] Интеграция с кастомными CSS классами:
  - [x] `uui-shadow-top`, `uui-shadow-bottom` с градиентами
  - [x] OverlayScrollbars тема `os-theme-uui`
  - [x] RTL-специфичные стили для скроллбаров
- [x] Интеграция с `withMods` системой

### Этап 4: Обновление зависимостей ✅
- [x] Обновление `package.json` в `uui-components`:
  - [x] Удалить `"react-custom-scrollbars-2": "^4.2.1"`
  - [x] Добавить `"overlayscrollbars-react": "^0.5.6"`
  - [x] Добавить `"overlayscrollbars": "^2.4.6"` (peer dependency)
- [x] Добавление CSS импорта в точку входа:
  - [x] `import 'overlayscrollbars/overlayscrollbars.css'` в ScrollBars.tsx
- [x] Обновление lock файлов (`yarn.lock`)

### Этап 5: Реализация замены ✅
- [x] Замена в `uui-components/src/layout/ScrollBars.tsx`
- [x] Обновление стилей с OverlayScrollbars темой
- [x] Проверка работы с `withMods` в `uui/components/layout/ScrollBars.tsx`
- [x] Успешная сборка пакета

### Этап 6: Тестирование интеграции
- [ ] Тестирование `VirtualList` - особое внимание к `useOverlayScrollbars` hook
- [ ] Тестирование `SlateEditor` - проверка `scrollbars` prop
- [ ] Тестирование `DataTable` - performance с большими данными
- [ ] Тестирование `PresetsPanel` - поведение в боковых панелях
- [ ] Проверка демо компонентов в `app/src/sandbox/`
- [ ] Проверка Next.js примеров - SSR совместимость
- [ ] Специальное тестирование:
  - [ ] Проверка `defer` инициализации для производительности
  - [ ] Тестирование в модальных окнах
  - [ ] Проверка nested scrollbars

### Этап 7: Исправление багов
- [ ] Исправление zoom level inconsistency (#2644)
- [ ] Проверка теней в модальных окнах
- [ ] Тестирование на разных браузерах
- [ ] Проверка accessibility

---

## 🧪 Тестирование

### Расширение тестового покрытия:
- [ ] Тесты для методов API (`getValues`, `scrollTop`, `scrollLeft`)
- [ ] Тесты для теней (`hasTopShadow`, `hasBottomShadow`)
- [ ] Тесты для RTL поддержки
- [ ] Тесты для кастомных рендеров
- [ ] Интеграционные тесты с `VirtualList`
- [ ] Тесты производительности

### Существующие тесты:
- [ ] Обновление snapshot тестов
- [ ] Проверка регрессий в `uui/components/layout/__tests__/ScrollBars.test.tsx`

---

## 📖 Документация

- [ ] Создание страницы документации для ScrollBars
- [ ] Примеры использования:
  - [ ] Базовое использование
  - [ ] С тенями
  - [ ] Кастомные рендеры
  - [ ] RTL поддержка
- [ ] Миграционный гайд для пользователей
- [ ] API референс
- [ ] Обновление changelog

---

## ⚠️ Критические точки внимания

### Breaking Changes Prevention:
- [ ] Проверка публичного API на совместимость
- [ ] Тестирование всех пропсов `ScrollbarProps`
- [ ] Проверка работы `ref` forwarding
- [ ] Валидация типов TypeScript

### Performance:
- [ ] Benchmark тесты для `VirtualList`
- [ ] Проверка memory leaks
- [ ] Тестирование с большими списками
- [ ] Оптимизация re-renders

### Cross-browser Support:
- [ ] Тестирование в Chrome
- [ ] Тестирование в Firefox
- [ ] Тестирование в Safari
- [ ] Тестирование в Edge
- [ ] Проверка мобильных браузеров

### Accessibility:
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] ARIA attributes
- [ ] Focus management

---

## 🚀 Релиз

- [ ] Code review всех изменений
- [ ] Проверка всех checkboxes в плане
- [ ] Обновление версий пакетов
- [ ] Публикация beta версии для тестирования
- [ ] Финальный релиз
- [ ] Закрытие issue #2664

---

## 📝 Заметки

### ✅ Выбранная библиотека: `overlayscrollbars-react`
- [x] **Название библиотеки:** overlayscrollbars-react + overlayscrollbars
- [x] **Оценка размера bundle:** 82.5 kB (unpacked), активно оптимизирована
- [x] **Проверка лицензии:** MIT - совместима с проектом
- [x] **Анализ maintenance статуса:** Активно поддерживается (последнее обновление год назад)
- [x] **Сравнение с альтернативами:** Превосходит по функциональности и производительности

#### Преимущества overlayscrollbars-react:
- ✅ TypeScript support из коробки
- ✅ 100k+ еженедельных загрузок
- ✅ Поддержка defer инициализации для производительности
- ✅ Гибкая система options и events
- ✅ Hook `useOverlayScrollbars` для интеграции с react-window/virtualized
- ✅ Активная поддержка и development

---

*Создано: 2024-12-21*
*Статус: Библиотека выбрана - overlayscrollbars-react. Готов к началу реализации.*

## 🎯 Оценка сложности миграции: **СРЕДНЯЯ**

### Благоприятные факторы:
- ✅ **API схожесть**: overlayscrollbars предоставляет аналогичные методы
- ✅ **TypeScript**: полная поддержка из коробки
- ✅ **Performance**: встроенная defer инициализация
- ✅ **Maintenance**: активно поддерживаемая библиотека (100k+ загрузок/неделю)
- ✅ **Документация**: хорошо документированный API

### Потенциальные сложности:
- ⚠️ **Custom renders**: потребуется адаптация через CSS/options вместо render props
- ⚠️ **API differences**: `getValues()` → `instance.state()`, разные параметры
- ⚠️ **Shadow system**: нужна кастомная реализация UUI теней
- ⚠️ **VirtualList integration**: может потребоваться переход на `useOverlayScrollbars` hook

### Временная оценка: **2-3 недели** разработки + тестирование

### Issues to track:
- [x] #2664 - [Scrollbars]: replace deprecated react-custom-scrollbars. Add documentation
- [x] #2893 - [RichTextEditor]: It's impossible to scroll up to the beginning of editor after pasting information
- [x] #2882 - [ScrollBars]: show horizontal scroll and arrows after some manipulation
- [ ] #2863 - useVirtualList: Sudden Jumping Issue During Scrolling
- [ ] #2788 - [Drag and Drop]: Drag and drop functionality in mobile view is not working correctly.
- [ ] #2692 - Scroll: improve visibility when content hidden under the scroll
- [ ] #2644 - [Scroll Bar]: inconsistent visibility of a bottom line across different zoom levels in modal window
- [ ] #2548 - [RTL]: collection of RTL issues
- [ ] #2021 - [Scroll Spy]: Incorrect highlighting of currently viewed section
- [ ] #1784 - [RTE]: doubling horizontal scrolling
- [ ] #1645 - [Scroll Spy]: horizontal scroll bar at the bottom of page after using scrollToElement function
- [ ] #886 - [LazyTree]: add auto-scrolling after expanding last item
- [ ] #605 - [Demo]: add scrolling to invalid fields on form demo