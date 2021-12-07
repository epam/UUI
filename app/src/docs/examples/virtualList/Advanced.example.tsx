import * as React from 'react';
import { useUuiContext, DataSourceState, useLazyDataSource, useVirtualList, DataRowProps, cx } from '@epam/uui';
import { BurgerButton, Text, MainMenu, MainMenuButton, FlexSpacer, GlobalMenu, TextPlaceholder } from '@epam/promo';
import { City } from '@epam/uui-docs';
import * as css from './Advanced.example.scss';

const UUI4 = 'UUI4_promo';

const Header = () => {
    const svc = useUuiContext();
    const { query: { category }, pathname } = svc.uuiRouter.getCurrentLink();

    const renderBurger = () => (
        <>
            <BurgerButton
                caption='Home'
                link={ { pathname: '/' } }
            />
            <BurgerButton
                caption='Documents'
                link={ { pathname: '/documents', query: { id: 'gettingStarted' } } }
                isLinkActive={ pathname === 'documents' && !category }
            />
            <BurgerButton
                caption='Assets'
                link={ { pathname: '/documents', query: { id: 'icons', category: 'assets' } } }
                isLinkActive={ pathname === '/documents' && category === 'assets' }
            />
            <BurgerButton
                caption='Components'
                link={ { pathname: '/documents', query: { id: 'accordion', mode: 'doc', skin: UUI4, category: 'components' } } }
                isLinkActive={ pathname === '/documents' && category === 'components' }
            />
            <BurgerButton
                caption='Demo'
                link={ { pathname: '/demo' } }
                isLinkActive={ pathname === '/demo' }
            />
        </>
    );

    return (
        <MainMenu cx={ css.menuContainer } renderBurger={ renderBurger } logoLink={ { pathname: '/' } } appLogoUrl='/static/logo.svg' logoWidth={ 168 }>
            <MainMenuButton
                caption="Documents"
                priority={ 3 }
                estimatedWidth={ 115 }
                link={ { pathname: '/documents', query: { id: 'gettingStarted' } } }
                isLinkActive={ pathname === '/documents' && category !== 'components' && category !== 'assets' }
                showInBurgerMenu
            />
            <MainMenuButton
                caption="Assets"
                priority={ 2 }
                estimatedWidth={ 80 }
                link={ { pathname: '/documents', query: { id: 'icons', category: 'assets' } } }
                isLinkActive={ pathname === '/documents' && category === 'assets' }
                showInBurgerMenu
            />
            <MainMenuButton
                caption="Components"
                priority={ 2 }
                estimatedWidth={ 124 }
                link={ { pathname: '/documents', query: { id: 'accordion', mode: 'doc', skin: UUI4, category: 'components' } } }
                isLinkActive={ pathname === '/documents' && category === 'components' }
                showInBurgerMenu
            />
            <MainMenuButton
                caption="Demo"
                priority={ 2 }
                estimatedWidth={ 77 }
                link={ { pathname: '/demo' } }
                isLinkActive={ pathname === '/demo' }
                showInBurgerMenu
            />
            { window.location.host.includes('localhost') && (
                <MainMenuButton
                    caption="Sandbox"
                    priority={ 1 }
                    estimatedWidth={ 97 }
                    link={ { pathname: '/sandbox' } }
                    isLinkActive={ pathname === '/sandbox' }
                />
            ) }
            <FlexSpacer priority={ 100500 } />
            <GlobalMenu estimatedWidth={ 60 } priority={ 100500 } />
        </MainMenu>
    );
}

export default function AdvancedVirtualList() {
    const svc = useUuiContext();
    const [value, onValueChange] = React.useState<DataSourceState>({
        topIndex: 0,
        visibleCount: 3,
        sorting: [{ field: 'name' }],
    });
    const citiesDataSource = useLazyDataSource<City, string, string>({ api: svc.api.demo.cities }, []);
    const rows = citiesDataSource.useView(value, onValueChange).getVisibleRows();
    const { listContainer, offsetY, handleScroll, estimatedHeight, scrollContainer } = useVirtualList<HTMLUListElement, HTMLDivElement>({
        value, onValueChange, rowsCount: citiesDataSource.useView(value, onValueChange).getListProps().rowsCount,
    });

    return (
        <div ref={ scrollContainer } onScroll={ handleScroll } className={ css.mainContainer }>
            <Header />
            <div className={ css.mainContainerWrapper } style={{ minHeight: `${estimatedHeight}px` }}>
                <ul ref={ listContainer } style={{ marginTop: `${offsetY}px` }} className={ css.mainContainerList }>
                    {rows.map(row => (
                        <li className={ cx(css.mainContainerListItem, css.text) } key={row.key + String(row.index) }>
                            { row.value ? <>
                                <Text font='museo-sans' size='36'>{ row.value.countryName }, <br /> { row.value.name }</Text>
                                <Text size='24' font='sans-italic'>Population: { row.value.population }</Text>
                            </> : <TextPlaceholder wordsCount={ 10 } /> }
                        </li>
                    )) }
                </ul>
            </div>
        </div>
    );
}