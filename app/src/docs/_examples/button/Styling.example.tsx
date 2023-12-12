import React from 'react';
import { FlexRow, Button, Panel } from '@epam/uui';

export default function StyledButtonsExample() {
    return (
        <div>
            <Panel>
                <FlexRow padding="6" vPadding="12" spacing="12">
                    <Button color="primary" caption="Caption" onClick={ () => null } />
                    <Button color="critical" caption="Caption" onClick={ () => null } />
                    <Button color="accent" caption="Caption" onClick={ () => null } />
                    <Button color="secondary" caption="Caption" onClick={ () => null } />
                </FlexRow>
                <FlexRow padding="6" vPadding="12" spacing="12">
                    <Button fill="outline" color="primary" caption="Caption" onClick={ () => null } />
                    <Button fill="outline" color="critical" caption="Caption" onClick={ () => null } />
                    <Button fill="outline" color="accent" caption="Caption" onClick={ () => null } />
                    <Button fill="outline" color="secondary" caption="Caption" onClick={ () => null } />
                </FlexRow>
                <FlexRow padding="6" vPadding="12" spacing="12">
                    <Button fill="none" color="primary" caption="Caption" onClick={ () => null } />
                    <Button fill="none" color="critical" caption="Caption" onClick={ () => null } />
                    <Button fill="none" color="accent" caption="Caption" onClick={ () => null } />
                    <Button fill="none" color="secondary" caption="Caption" onClick={ () => null } />
                </FlexRow>
                <FlexRow padding="6" vPadding="12" spacing="12">
                    <Button fill="ghost" color="primary" caption="Caption" onClick={ () => null } />
                    <Button fill="ghost" color="critical" caption="Caption" onClick={ () => null } />
                    <Button fill="ghost" color="accent" caption="Caption" onClick={ () => null } />
                    <Button fill="ghost" color="secondary" caption="Caption" onClick={ () => null } />
                </FlexRow>
            </Panel>
        </div>
    );
}
