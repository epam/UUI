import React from 'react';
import { FlexRow, Button } from '@epam/uui';
import css from './Button.module.scss';

export default function StyledButtonsExample() {
    return (
        <FlexRow>
            <div className={ css.column }>
                <Button color="primary" caption="Caption" onClick={ () => null } />
                <Button fill="outline" color="primary" caption="Caption" onClick={ () => null } />
                <Button fill="none" color="primary" caption="Caption" onClick={ () => null } />
                <Button fill="ghost" color="primary" caption="Caption" onClick={ () => null } />
            </div>
            <div className={ css.column }>
                <Button color="critical" caption="Caption" onClick={ () => null } />
                <Button fill="outline" color="critical" caption="Caption" onClick={ () => null } />
                <Button fill="none" color="critical" caption="Caption" onClick={ () => null } />
                <Button fill="ghost" color="critical" caption="Caption" onClick={ () => null } />
            </div>
            <div className={ css.column }>
                <Button color="accent" caption="Caption" onClick={ () => null } />
                <Button fill="outline" color="accent" caption="Caption" onClick={ () => null } />
                <Button fill="none" color="accent" caption="Caption" onClick={ () => null } />
                <Button fill="ghost" color="accent" caption="Caption" onClick={ () => null } />
            </div>
            <div className={ css.column }>
                <Button color="secondary" caption="Caption" onClick={ () => null } />
                <Button fill="outline" color="secondary" caption="Caption" onClick={ () => null } />
                <Button fill="none" color="secondary" caption="Caption" onClick={ () => null } />
                <Button fill="ghost" color="secondary" caption="Caption" onClick={ () => null } />
            </div>
            <div className={ css.whiteColumn }>
                <Button isDisabled={ true } color="white" caption="Caption" onClick={ () => null } />
                <Button isDisabled={ true } fill="outline" color="white" caption="Caption" onClick={ () => null } />
                <Button isDisabled={ true } fill="none" color="white" caption="Caption" onClick={ () => null } />
                <Button isDisabled={ true } fill="ghost" color="white" caption="Caption" onClick={ () => null } />
            </div>
        </FlexRow>
    );
}
