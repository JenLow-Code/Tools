# Tools identity gateway

The public identity gateway api-tools.jenlow.net has no database binding and no signing secret. It calls the fixed ToolsSecurity private entrypoint of JenLow Core. Network tokens are not accepted. The catalogue and studio UI remain unchanged; authenticated business writes require the separately reviewed Tools operational schema. The currently deployed Tools D1 is empty; do not apply historical seeds or enable unauthenticated writes. The browser sign-in flow is a separate integration and must not report successful authentication unless Core verifies it.
