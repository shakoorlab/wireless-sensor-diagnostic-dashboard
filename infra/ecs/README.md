Reminder on how to register/update task defs

aws ecs register-task-definition --cli-input-json file://infra/ecs/sensor-api.json

The images were built locally on an ARM-based Mac (M1/M2), so Docker produced an arm64 image. Fargate by default expects x86_64, so when it tries to exec the ARM binary it fails with that error. Update the task definition whose container image is built for ARM64, to tell Fargate to run it on Graviton.
