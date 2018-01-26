import { assertOrThrow, pick } from '../utils'
import { REPORT_TYPES } from '../models/report'
import { USER_ROLES } from '../models/user'

export async function report(req, res) {
    const { Report } = req.app.get('models')
    const { user } = res.locals

    const input = pick(req.body, 'type body id')

    const report = {
        accuser: user.id,
        body: input.body,
    }

    assertOrThrow(input.type, Error, 'Report type is required')

    assertOrThrow(Object.values(REPORT_TYPES).includes(input.type), Error, 'Invalid value for report type')

    report.type = input.type
    report[input.type + 'Id'] = input.id

    await Report.create(report)
    res.send(report)
}

export async function getReports(req, res) {
    const { Report, User, Post, Blog } = req.app.get('models')
    const { user } = res.locals

    assertOrThrow(user.role === USER_ROLES.ADMIN, Error, 'Insufficient rights')

    const reports = await Report.findAll({include: [{all: true}]})

    res.send(reports)
}