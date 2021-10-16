import * as area_controller from "./area.controller"
import * as area_service from "./area.service"

import * as base_dto from "../base.dto"
describe("findListByPId", () => {
    let inst: any
    let inst2: any

    beforeEach(() => {
        inst = new area_service.AreaService(undefined)
        inst2 = new area_controller.AreaController(inst)
    })

    test("0", async () => {
        let param1: any = new base_dto.BaseFindByPIdDto()
        await inst2.findListByPId(param1)
    })
})

describe("findTree", () => {
    let inst: any
    let inst2: any

    beforeEach(() => {
        inst = new area_service.AreaService(undefined)
        inst2 = new area_controller.AreaController(inst)
    })

    test("0", async () => {
        await inst2.findTree("user name")
    })

    test("1", async () => {
        await inst2.findTree("username")
    })

    test("2", async () => {
        await inst2.findTree("user_name")
    })

    test("3", async () => {
        await inst2.findTree(false)
    })

    test("4", async () => {
        await inst2.findTree(12)
    })

    test("5", async () => {
        await inst2.findTree(NaN)
    })
})

describe("findTreeByPId", () => {
    let inst: any
    let inst2: any

    beforeEach(() => {
        inst = new area_service.AreaService(undefined)
        inst2 = new area_controller.AreaController(inst)
    })

    test("0", async () => {
        let param1: any = new base_dto.BaseFindByPIdDto()
        await inst2.findTreeByPId(param1)
    })
})

// @ponicode
describe("findById", () => {
    let inst: any
    let inst2: any

    beforeEach(() => {
        inst = new area_service.AreaService(undefined)
        inst2 = new area_controller.AreaController(inst)
    })

    test("0", async () => {
        let param1: any = new base_dto.BaseFindByIdDto()
        await inst2.findById(param1)
    })
})
