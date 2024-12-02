import { createClient } from '@supabase/supabase-js'
import JSONbigClass from 'json-bigint'

const JSONbig = JSONbigClass({ useNativeBigInt: true })

// The below Serializer class draws heavily from https://github.com/phoenixframework/phoenix/commit/cf098e9cf7a44ee6479d31d911a97d3c7430c6fe
// License: https://github.com/phoenixframework/phoenix/blob/master/LICENSE.md
//
// Modified from Supabase's default serializer to handle BigInt data types correctly
//
export default class Serializer {
    HEADER_LENGTH = 1

    decode(rawPayload: ArrayBuffer | string, callback: Function) {
        if (rawPayload.constructor === ArrayBuffer) {
            return callback(this._binaryDecode(rawPayload))
        }

        if (typeof rawPayload === 'string') {
            return callback(JSONbig.parse(rawPayload))
        }

        return callback({})
    }

    private _binaryDecode(buffer: ArrayBuffer) {
        const view = new DataView(buffer)
        const decoder = new TextDecoder()

        return this._decodeBroadcast(buffer, view, decoder)
    }

    private _decodeBroadcast(
        buffer: ArrayBuffer,
        view: DataView,
        decoder: TextDecoder
    ): {
        ref: null
        topic: string
        event: string
        payload: { [key: string]: any }
    } {
        const topicSize = view.getUint8(1)
        const eventSize = view.getUint8(2)
        let offset = this.HEADER_LENGTH + 2
        const topic = decoder.decode(buffer.slice(offset, offset + topicSize))
        offset = offset + topicSize
        const event = decoder.decode(buffer.slice(offset, offset + eventSize))
        offset = offset + eventSize
        const rawData = decoder.decode(buffer.slice(offset, buffer.byteLength))
        const data = JSONbig.parse(rawData)

        return { ref: null, topic: topic, event: event, payload: data }
    }
}
const serializer  = new Serializer()


function generateClientRaw() {
    const supabaseUrl = process.env.SUPABASE_URL
    if (!supabaseUrl) throw new Error('SUPABASE_URL is not defined in the environment variables.')
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY
    if (!supabaseSecretKey) throw new Error('SUPABASE_SECRET_KEY is not defined in the environment variables.')

    return createClient(
        supabaseUrl,
        supabaseSecretKey,
        {
            realtime: {
                decode: serializer.decode.bind(serializer)
            }
        }
    )
}

function generateClientSafe(): ReturnType<typeof generateClientRaw> {
    if (typeof window === 'undefined') {
        return generateClientRaw()
    }

    return new Proxy({}, {
        get() {
            throw new Error('Cannot access the Supabase client from the client-side.')
        }
    }) as any
}

export const supabase = generateClientSafe()
