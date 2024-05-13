type TEnvParams = {
    isCi: boolean;
    isDocker: boolean;
    UUI_DOCKER_HOST_MACHINE_IP?: string;
    UUI_TEST_PARAM_PROJECT?: string,
    UUI_TEST_PARAM_ONLY_FAILED?: boolean,
    UUI_TEST_PARAM_CHECK_ISSUES?: boolean,
    UUI_TEST_PARAM_UPDATE_SNAPSHOTS?: boolean,
};
export function readUuiSpecificEnvVariables(): TEnvParams {
    const {
        UUI_IS_DOCKER,
        CI,
        UUI_DOCKER_HOST_MACHINE_IP,
        //
        UUI_TEST_PARAM_PROJECT,
        UUI_TEST_PARAM_ONLY_FAILED,
        UUI_TEST_PARAM_CHECK_ISSUES,
        UUI_TEST_PARAM_UPDATE_SNAPSHOTS,
        //
    } = process.env;
    return {
        isDocker: UUI_IS_DOCKER === 'true',
        isCi: !!CI,
        UUI_DOCKER_HOST_MACHINE_IP,
        UUI_TEST_PARAM_PROJECT,
        UUI_TEST_PARAM_ONLY_FAILED: UUI_TEST_PARAM_ONLY_FAILED === 'true',
        UUI_TEST_PARAM_CHECK_ISSUES: UUI_TEST_PARAM_CHECK_ISSUES === 'true',
        UUI_TEST_PARAM_UPDATE_SNAPSHOTS: UUI_TEST_PARAM_UPDATE_SNAPSHOTS === 'true',
    };
}
