import * as React from 'react';
import { useUuiContext, DataSourceState, useLazyDataSource, useVirtualList, cx } from '@epam/uui';
import { Text, MainMenu, TextPlaceholder, MainMenuButton } from '@epam/promo';
import { City } from '@epam/uui-docs';
import css from './AdvancedExample.scss';

function Header() {
    return (
        <MainMenu cx={css.menuContainer} logoLink={{ pathname: '/' }} appLogoUrl="/static/logo.svg" logoWidth={168}>
            <MainMenuButton caption="Home" />
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
    const { getVisibleRows, getListProps } = citiesDataSource.useView(value, onValueChange, {});
    const { listContainerRef, offsetY, handleScroll, scrollContainerRef, estimatedHeight } = useVirtualList({
        value,
        onValueChange,
        rowsCount: getListProps().rowsCount,
    });

    return (
        <div ref={scrollContainerRef} onScroll={handleScroll} className={css.mainContainer}>
            <Header />
            <div className={css.mainContainerWrapper} style={{ minHeight: `${estimatedHeight}px` }}>
                <ul ref={listContainerRef} style={{ marginTop: `${offsetY}px` }} className={css.mainContainerList}>
                    {getVisibleRows().map(row => (
                        <li className={css.mainContainerListItem} key={row.key + String(row.index)}>
                            {row.value ? (
                                <>
                                    <Text font="museo-sans" size="36">
                                        {row.value.countryName}, <br /> {row.value.name}
                                    </Text>
                                    <Text size="24" font="sans-italic">
                                        Population: {row.value.population}
                                    </Text>
                                </>
                            ) : (
                                <TextPlaceholder wordsCount={10} />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
