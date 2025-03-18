import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '../helpers';
import { docExampleLoader } from '../common/docs/docExampleLoader';
import { DocExampleContent } from './docExampleContent';

export function DocExamplePage() {
    const [component, setComponent] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const examplePath = useQuery('examplePath'); // E.g.: http://localhost:3793/docExample?examplePath=alert/Basic

    useEffect(() => {
        let isDestroyed = false;
        if (examplePath) {
            setComponent(null);
            setIsLoading(true);
            docExampleLoader({ shortPath: examplePath })
                .then((result) => {
                    if (!isDestroyed) {
                        setComponent(() => result);
                    }
                })
                .catch((err) => {
                    if (!isDestroyed) {
                        console.error(`Unable to load example examplePath=${examplePath}`, err);
                    }
                })
                .finally(() => {
                    if (!isDestroyed) {
                        setIsLoading(false);
                    }
                });
        } else {
            setIsLoading(false);
        }
        return () => {
            isDestroyed = true;
        };
    }, [examplePath]);

    const errorMsg = useMemo(() => {
        if (!examplePath) {
            return 'Required query parameter is missing: examplePath';
        }
        if (!isLoading && !component) {
            return `Unable to load example; examplePath=${examplePath}`;
        }
    }, [component, examplePath, isLoading]);

    return (
        <DocExampleContent
            isLoading={ isLoading }
            Component={ component }
            errorMsg={ errorMsg }
        />
    );
}
