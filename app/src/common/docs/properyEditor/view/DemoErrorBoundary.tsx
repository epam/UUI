import * as React from 'react';
import { Button, FlexRow, Text } from '@epam/uui';
import { ReactComponent as UpdateIcon } from '@epam/assets/icons/common/navigation-refresh-12.svg';

type TDemoErrorBoundaryState = {
    isRenderBlocked: boolean;
    error?: Error
    errorInfo?: React.ErrorInfo
};
export class DemoErrorBoundary extends React.Component<{ children: React.ReactNode }, TDemoErrorBoundaryState> {
    static displayName = 'LocalErrorBoundary';
    state: TDemoErrorBoundaryState = { isRenderBlocked: false };

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({
            error,
            errorInfo,
            isRenderBlocked: true,
        });
    }

    handleRetry = () => {
        this.setState({
            error: undefined,
            errorInfo: undefined,
            isRenderBlocked: false,
        });
    };

    render() {
        const { children } = this.props;
        const { isRenderBlocked } = this.state;
        if (isRenderBlocked) {
            return (
                <div>
                    <FlexRow columnGap="12" padding="12">
                        <Text color="critical">
                            An error has occured. Please check the browser console for details.
                            You might need to set different props values and try again.
                            <Button
                                fill="ghost"
                                icon={ UpdateIcon }
                                caption="Try again"
                                onClick={ this.handleRetry }
                            />
                        </Text>
                    </FlexRow>
                </div>
            );
        }
        return children;
    }
}
