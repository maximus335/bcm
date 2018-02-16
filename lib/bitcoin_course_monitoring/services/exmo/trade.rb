# encoding: utf-8

module BitcoinCourseMonitoring
  module Services
    module Exmo
      # @author Алейников Максим <m.v.aleinikov@gmail.com>
      #
      # Класс возвращающий информацию по крсу валютных пар
      #
      class Trade
        COMMISSION = 0.002

        URL = 'https://api.exmo.com/v1'.freeze

        PAIR = :BTC_USD

        TREND_SIZE = 30

        def initialize
          @margin = 0.02
          @order_price = 10
          book = order_book
          @min = book[:ask_top].to_f
          @max = book[:bid_top].to_f
          @trend = [min]
          @start_course = min
        end

        attr_reader :margin, :order_price, :start_course

        attr_reader :max, :min

        attr_reader :bought, :trend

        def profit(bid)
          (1 - COMMISSION) * bid - (1 + COMMISSION) * start_course
        end

        def uptrend?
          trend_is_full? &&
            trend.each_cons(2).all? { |prev_val, next_val| prev_val < next_val }
        end

        def downtrend?
          trend_is_full? &&
            trend.each_cons(2).all? { |prev_val, next_val| prev_val > next_val }
        end

        def update_trend(new_price)
          print "update_trend: #{trend} => "
          trend.shift if trend_is_full?
          trend.push(new_price)
          p trend.to_s
        end

        def trend_is_full?
          trend.size >= TREND_SIZE
        end

        def start
            loop do
              book = order_book
              bid = book[:bid_top].to_f
              ask = book[:ask_top].to_f
              if bought
                p "bid: #{bid}"
                p "Прибыль: #{profit(bid)}"
                @max = bid if bid > max
                update_trend(bid) if bid != trend.last
                profit = profit(bid)
                if profit.positive? && !positive_slope?
                  p "profit: #{profit}"
                  @bought = false
                  @min = ask
                  @trend = [ask]
                  @start_course = ask
                  p "SELL! #{bid - 0.000001}"
                end
              else
                p "ask: #{ask}"
                p "Падение цены: #{start_course - ask}"
                @min = ask if ask < min
                update_trend(ask) if ask != trend.last
                if positive_slope?
                  @bought = true
                  @max = bid
                  @trend = [bid]
                  @start_course = ask + 0.000001
                  p "BUY! #{ask + 0.000001}"
                end
              end
              sleep 1
            end
        end

        def numbers_average
          (trend.size + 1) / 2.to_f
        end

        def values_average
          trend.reduce(:+) / trend.size.to_f
        end

        def sum_of_squares_of_numbers
          trend_size = trend.size
          trend_size * (trend_size + 1) * (2 * trend_size + 1) / 6.to_f
        end

        def sum_of_multiplication
          trend.each_with_index.inject(0) do |sum, (val, i)|
            sum + (val * (i + 1))
          end
        end

        def positive_slope?
          p slope
          return unless trend_is_full?
          slope > 0
        end

        def slope
          numbers_avg = numbers_average
          trend_size = trend.size
          (sum_of_multiplication - trend_size * numbers_avg * values_average) /
            (sum_of_squares_of_numbers - trend_size * numbers_avg ** 2)
        end

        def order_book
          request('order_book', pair: 'BTC_USD', limit: 1)
        end

        def pair_settings
          request('pair_settings')
        end

        def request(to, params)
          response = RestClient.get("#{URL}/#{to}", params: params)
          parse(response.body)[PAIR]
        end

        def parse(json)
          JSON.parse(json, symbolize_names: true)
        end

        Trade.new.start
      end
    end
  end
end