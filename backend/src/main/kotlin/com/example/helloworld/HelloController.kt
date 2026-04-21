package com.example.helloworld

import org.springframework.web.bind.annotation.*
import org.springframework.web.client.RestTemplate

data class ValuationRequest(
    val ingresos: Double = 0.0,
    val ebitda: Double = 0.0,
    val deudaNeta: Double = 0.0,
    val sector: String = ""
)

data class ValuationResult(
    val equityValueMinUSD: Double,
    val equityValueMaxUSD: Double,
    val equityValueMinARS: Double,
    val equityValueMaxARS: Double,
    val evMinUSD: Double,
    val evMaxUSD: Double,
    val multiploMin: Double,
    val multiploMax: Double,
    val tipoDolarBlue: Double,
    val sector: String
)

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = ["http://localhost:3000"])
class ValuationController {

    private val restTemplate = RestTemplate()

    companion object {
        val SECTOR_MULTIPLES = mapOf(
            "tecnologia"   to Pair(6.0, 8.0),
            "retail"       to Pair(3.0, 5.0),
            "servicios"    to Pair(4.0, 6.0),
            "manufactura"  to Pair(4.0, 6.0),
            "construccion" to Pair(5.0, 7.0),
            "agro"         to Pair(4.0, 6.0),
            "salud"        to Pair(5.0, 8.0),
            "medios"       to Pair(3.0, 6.0)
        )
    }

    @GetMapping("/dolar")
    fun getDolar(): Map<String, Any> {
        return try {
            @Suppress("UNCHECKED_CAST")
            val response = restTemplate.getForObject(
                "https://dolarapi.com/v1/dolares/blue",
                Map::class.java
            ) as Map<String, Any>
            mapOf(
                "venta" to (response["venta"] ?: 0.0),
                "compra" to (response["compra"] ?: 0.0),
                "fechaActualizacion" to (response["fechaActualizacion"] ?: "")
            )
        } catch (e: Exception) {
            mapOf("error" to "No se pudo obtener el tipo de cambio", "venta" to 0.0)
        }
    }

    @PostMapping("/valuation")
    fun calculate(@RequestBody request: ValuationRequest): ValuationResult {
        val (multiploMin, multiploMax) = SECTOR_MULTIPLES[request.sector] ?: Pair(4.0, 6.0)

        val dolarData = getDolar()
        val tipoDolar = (dolarData["venta"] as? Number)?.toDouble() ?: 1200.0

        val evMinARS = request.ebitda * multiploMin
        val evMaxARS = request.ebitda * multiploMax

        val equityMinARS = maxOf(0.0, evMinARS - request.deudaNeta)
        val equityMaxARS = maxOf(0.0, evMaxARS - request.deudaNeta)

        return ValuationResult(
            equityValueMinUSD = equityMinARS / tipoDolar,
            equityValueMaxUSD = equityMaxARS / tipoDolar,
            equityValueMinARS = equityMinARS,
            equityValueMaxARS = equityMaxARS,
            evMinUSD = evMinARS / tipoDolar,
            evMaxUSD = evMaxARS / tipoDolar,
            multiploMin = multiploMin,
            multiploMax = multiploMax,
            tipoDolarBlue = tipoDolar,
            sector = request.sector
        )
    }
}
