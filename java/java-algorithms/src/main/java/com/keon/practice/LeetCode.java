package com.keon.practice;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Queue;
import java.util.Set;
import java.util.TreeMap;

import static java.util.stream.Collectors.toList;

public class LeetCode {

    static class MatrixRotator {

        static int replace(final int[] a, final int index, final int newVal) {
            final int existing = a[index];
            a[index] = newVal;
            return existing;
        }

        static void rotate(final int[][] matrix, final int xOffset, final int yOffset) {
            final int xMin = xOffset;
            final int yMin = yOffset;
            final int xMax = matrix.length - xOffset; //exclusive
            final int yMax = matrix[0].length - yOffset; //exclusive
            int previous = matrix[xMin][yMin + 1];
            //down
            for (int x = xMin; x < xMax; ++x) {
                previous = replace(matrix[x], yMin, previous);
            }
            //right
            for (int y = yMin + 1; y < yMax; ++y) {
                previous = replace(matrix[xMax - 1], y, previous);
            }
            //up
            for (int x = xMax - 2; x >= xMin; --x) {
                previous = replace(matrix[x], yMax - 1, previous);
            }
            //left
            for (int y = yMax - 2; y > yMin; --y) {
                previous = replace(matrix[xMin], y, previous);
            }
        }

        private static int gcd(final int x, final int y) {
            return (y == 0) ? x : gcd(y, x % y);
        }

        public static int gcd(final Collection<Integer> numbers) {
            return numbers.stream().reduce(0, (x, y) -> gcd(x, y));
        }

        public static int lcm(final Collection<Integer> numbers) {
            return numbers.stream().reduce(1, (x, y) -> x * (y / gcd(x, y)));
        }

        static void rotate(final int[][] matrix) {
            final int centerX = matrix.length / 2;
            final int centerY = matrix[0].length / 2;
            for (int x = 0, y = 0; x < centerX && y < centerY; x++, y++) {
                rotate(matrix, x, y);
            }
        }

        static int effectivePeriod(final int[][] matrix) {
            final int centerX = matrix.length / 2;
            final int centerY = matrix[0].length / 2;
            final List<Integer> periods = new ArrayList<>();
            for (int x = 0, y = 0; x < centerX && y < centerY; x++, y++) {
                periods.add(2 * (matrix.length - x + matrix[0].length - y + 2));
            }
            //get lcm
            return lcm(periods);
        }

        static void matrixRotation(final List<List<Integer>> l, int r) {
            final int[][] matrix = convert(l);
            r = r % effectivePeriod(matrix);
            for (int i = 0; i < r; ++i) {
                rotate(matrix);
                if (convert(matrix).equals(l)) {
                    continue;
                }
            }
            print(matrix);
        }

        static void print(final int[][] matrix) {
            for (int i = 0; i < matrix.length; ++i) {
                for (int j = 0; j < matrix[0].length; ++j) {
                    System.out.print(matrix[i][j] + " ");
                }
                System.out.println();
            }
        }

        static int[][] convert(final List<List<Integer>> a) {
            final int[][] matrix = new int[a.size()][a.get(0).size()];
            for (int i = 0; i < matrix.length; ++i) {
                for (int j = 0; j < matrix[0].length; ++j) {
                    matrix[i][j] = a.get(i).get(j);
                }
            }
            return matrix;
        }

        //==================
        static List<List<Integer>> readInput() throws Exception {
            final List<List<Integer>> matrix = new ArrayList<>();
            for (final String line : Files.readAllLines(Paths.get(LeetCode.class.getResource("/matrix.txt").toURI()))) {
                matrix.add(Arrays.stream(line.replaceAll("\\s+$", "").split(" ")).map(Integer::parseInt).collect(toList()));
            }
            return matrix;
        }

        static List<List<Integer>> convert(final int[][] a) {
            final List<List<Integer>> matrix = new ArrayList<>();
            for (final int[] ints : a) {
                matrix.add(Arrays.stream(ints).boxed().collect(toList()));
            }
            return matrix;
        }
    }

    static class SmallestSumSubArray {

        static int sum(final int[] x) {
            return java.util.Arrays.stream(x).sum();
        }

        public int shortestSubarray(final int[] A, final int K) {
//            for (int p = 1; p <= a.length; ++p) {
//                int[][] subsets = new int[a.length - p + 1][p];
//                for (int i = 0; i < subsets.length; ++i) {
//                    for (int j = 0; j < p; ++j) {
//                        subsets[i][j] = a[i + j];
//                    }
//                    int sum = sum(subsets[i]);
//                    if (sum == k) {
//                        return subsets[i].length;
//                    }
//                }
//                continue;
//            }
//            return -1;
            int sum, left = 0, right = 0, result = -1;

            if (A == null || A.length == 0) {
                return result;
            }

            sum = A[right++];
            while (left < A.length) {
                if (right < A.length && sum < K) {
                    sum += A[right++];
                } else {
                    if (sum == K) {
                        result = result == -1 ? right - left : Math.min(result, right - left);
                    }
                    if (left < A.length) {
                        sum -= A[left++];
                    }
                }
            }
            return result;
        }
    }

    static class RemoveDigits {

        static List<Integer> sortBySmallestIndices(final int[] num) {
            class Pair {
                final int x;
                final int i;

                Pair(final int x, final int i) {
                    this.x = x;
                    this.i = i;
                }
            }
            final List<Pair> s = new ArrayList<>();
            for (int i = 0; i < num.length; ++i) {
                s.add(new Pair(num[i], i));
            }
            s.sort(Comparator.comparingInt(o -> o.x));
            return s.stream().map(x -> x.i).collect(toList());
        }


        public Integer[] removeKDigits(final int[] num, final int k) {
            final Map<Integer, Integer> result = new TreeMap<>();
            final int digits = num.length - k;
            final List<Integer> sorted = sortBySmallestIndices(num);
            for (int i = 1; i <= digits; ++i) {
                final int index = sorted.get(i - 1);
                result.put(index, num[index]);
            }
            return result.values().toArray(new Integer[0]);
        }
    }

    static class MaxPointsOnLine {

        static class Line {
            double slope;
            double intercept;

            Line(final double slope, final Point p) {
                this.slope = slope;
                this.intercept = p.y - slope * p.x;
            }

            @Override
            public int hashCode() {
                return Objects.hash(slope, intercept);
            }

            @Override
            public boolean equals(final Object o) {
                return slope == ((Line) o).slope && intercept == ((Line) o).intercept;
            }

            boolean isColinear(final Point p) {
                return Math.abs(p.y - (p.x * slope + intercept)) < 0.0001d; //tolerance
            }

        }

        static class Point {
            int x, y;

            Point(final int x, final int y) {
                this.x = x;
                this.y = y;
            }

            @Override
            public int hashCode() {
                return Objects.hash(x, y);
            }

            @Override
            public boolean equals(final Object o) {
                return x == ((Point) o).x && y == ((Point) o).y;
            }

            double slopeRelativeTo(final Point other) {
                return ((double) ((other.y) - y)) / (other.x - x);
            }
        }

        public int maxPoints(final int[][] points) {
            final List<Point> all = new ArrayList<>();
            for (int i = 0; i < points.length; ++i) {
                all.add(new Point(points[i][0], points[i][1]));
            }
            final Map<Line, Set<Point>> countMap = new HashMap<>();
            for (final Point p1 : all) {
                for (final Point p2 : all) {
                    if (p2 != p1) {
                        final Line l = new Line(p2.slopeRelativeTo(p1), p2);
                        final Set<Point> colinear = countMap.computeIfAbsent(l, k -> new HashSet<>());
                        colinear.add(p1);
                        colinear.add(p2);
                    }
                }
            }
            return Collections.max(countMap.values().stream().map(x -> x.size()).collect(toList()));
        }
    }


    static class MyAtoi {
        static int toInt(final boolean negative, final String s) {
            int result = 0;
            for (int i = 0; i < s.length(); ++i) {
                final int digit = (int) s.charAt(i) - 48;
                final int multiplier = (int) Math.pow(10, s.length() - i - 1);
                result += digit * multiplier;
            }
            if (result < 0) { //there was an overflow
                result = negative ? Integer.MIN_VALUE : Integer.MAX_VALUE - 1;
            }
            return (negative ? -1 : 1) * result;
        }

        int myAtoi(String s) {
            s = s.trim();
            boolean negative = false;
            if (s.charAt(0) == '-') {
                negative = true;
                s = s.substring(1);
            } else if (s.charAt(0) == '+') {
                s = s.substring(1);
            }
            int lastExclusiveIndex = s.length();
            for (int i = 0; i < lastExclusiveIndex; ++i) {
                final char c = s.charAt(i);
                if (c < 48 || c > 57) {
                    lastExclusiveIndex = i;
                    break;
                }
            }
            return toInt(negative, s.substring(0, lastExclusiveIndex));
        }
    }

    static class StrongPasswordChecker {

        static int getConsecutives(final StringBuilder copy) {
            int steps = 0;
            for (int i = 1; i < copy.length() - 1; ++i) {
                if (copy.charAt(i - 1) == copy.charAt(i) && copy.charAt(i) == copy.charAt(i + 1)) {
                    copy.replace(i, i + 1, "?"); //replace with disallowed char
                    steps++;
                }
            }
            return steps;
        }

        int strongPasswordChecker(final String password) {
            int steps = 0;
            final int lengthDifference = password.length() < 6 ? 6 - password.length() : password.length() > 20 ? password.length() - 20 : 0;
            steps += lengthDifference;
            //seek casing/digits reqs
            boolean lowerSeen = false;
            boolean upperSeen = false;
            boolean digitSeen = false;
            for (final char c : password.toCharArray()) {
                if (!upperSeen && c >= 65 && c <= 90) {
                    upperSeen = true;
                }
                if (!lowerSeen && c >= 97 && c <= 122) {
                    lowerSeen = true;
                }
                if (!digitSeen && c >= 48 && c <= 57) {
                    digitSeen = true;
                }
            }
            int extraSteps = 0;
            if (!lowerSeen) {
                extraSteps++;
            }
            if (!upperSeen) {
                extraSteps++;
            }
            if (!digitSeen) {
                extraSteps++;
            }
            //can we absorb?
            if (steps <= extraSteps) {
                steps = extraSteps;
            }
            //consecutives
            if (password.length() > 20) {
                int min = Integer.MAX_VALUE;
                for (int i = 0; i + 20 < password.length(); ++i) {
                    final int c = getConsecutives(new StringBuilder(password.substring(i, i + 20)));
                    if (c < min) {
                        min = c;
                    }
                }
                steps += min;
            } else {
                steps += getConsecutives(new StringBuilder(password));
            }
            return steps;
        }

    }

    static class Assessment {

//        public int solution(int[] A) {
//            // write your code in Java SE 8
//            final Set<Integer> sorted = Arrays.stream(A).filter(x -> x > 0).boxed().collect(Collectors.toCollection(TreeSet::new));
//            int prev = 1;
//            for (int x : sorted) {
//                if (x > prev + 1) {
//                    return prev + 1;
//                }
//                prev = x;
//            }
//            return 1;
//        }

//        public int solution(int n) {
//            final String binary = Integer.toBinaryString(n);
//            int minIndex = binary.indexOf('1');
//            int maxIndex = binary.lastIndexOf('1');
//            if (minIndex == -1 || maxIndex == -1 || minIndex == maxIndex) {
//                return 0;
//            }
//            int longest = 0;
//            int count = 0;
//            for (int i = minIndex; i < maxIndex; ++i) {
//                if (binary.charAt(i) == '0') {
//                    count++;
//                    if (count > longest) {
//                        longest = count;
//                    }
//                } else {
//                    count = 0;
//                }
//            }
//            return longest;
//        }

    }

    static class SuperReducedString {

        StringBuilder superReducedString(final StringBuilder b) {
            if (b.length() == 0) {
                return b;
            }
//            StringBuilder b2 = new StringBuilder();
//            boolean changed = false;
//            for (int i = 0; i < b.length(); ++i) {
//                if (i + 1 < b.length() && b.charAt(i) == b.charAt(i + 1)) {
//                    i++;
//                    changed = true;
//                } else {
//                    b2.append(b.charAt(i));
//                }
//            }
//            b = b2;
            boolean changed = false;
            for (int i = 0; i < b.length(); ) {
                if (i + 1 < b.length() && b.charAt(i) == b.charAt(i + 1)) {
                    b.deleteCharAt(i);
                    b.deleteCharAt(i);
                    changed = true;
                } else {
                    i++;
                }
            }
            if (changed) {
                return superReducedString(b);
            }
            return b;
        }

        String superReducedString(final String s) {
            final StringBuilder b = superReducedString(new StringBuilder(s));
            if (b.length() == 0) {
                return "Empty String";
            }
            return b.toString();
        }

    }

    static class SimilarStrings {

        static boolean areSimilar(final String s1, final String s2) {
            if (s1.length() != s2.length()) {
                return false;
            }
            for (int i = 0; i + 1 < s1.length(); ++i) {
                if (s1.charAt(i) == s1.charAt(i + 1) && s2.charAt(i) != s2.charAt(i + 1)) {
                    return false;
                }
                if (s2.charAt(i) == s2.charAt(i + 1) && s1.charAt(i) != s1.charAt(i + 1)) {
                    return false;
                }
            }
            return true;
        }

    }

    static class Alternate {

        static char[][] getPairs(final java.util.Set<Character> chars) {
            final char[][] pairs = new char[chars.size() * (chars.size() - 1) / 2][2];
            final Character[] arr = chars.toArray(new Character[0]);
            int index = 0;
            for (int i = 0; i < arr.length; ++i) {
                for (int j = i + 1; j < arr.length; ++j) {
                    pairs[index][0] = arr[i];
                    pairs[index][1] = arr[j];
                    index++;
                }
            }
            return pairs;
        }

        static int consecutivesLength(final char c1, final char c2, final String s) {
            //first filter
            final StringBuilder builder = new StringBuilder();
            for (int i = 0; i < s.length(); ++i) {
                final char char1 = s.charAt(i);
                if (char1 == c1 || char1 == c2) {
                    builder.append(char1);
                }
            }
            if (builder.length() == 0) {
                return 0;
            }
            //now ensure it all alternates
            char prev = builder.charAt(0);
            for (int i = 1; i < builder.length(); ++i) {
                if (prev == builder.charAt(i)) {
                    return 0; //bad string
                }
                prev = builder.charAt(i);
            }
            return builder.length();
        }

        static int alternate(final String s) {
            if (s.length() == 0 || s.length() == 1) {
                return 0;
            }
            final java.util.Set<Character> chars = new java.util.HashSet<>();
            for (int i = 0; i < s.length(); ++i) {
                chars.add(s.charAt(i));
            }
            //collect all pairs
            final char[][] pairs = getPairs(chars);
            int maxLength = 0;
            for (final char[] pair : pairs) {
                final int length = consecutivesLength(pair[0], pair[1], s);
                if (length > maxLength) {
                    maxLength = length;
                }
            }
            return maxLength;
        }

    }

    static class BoundedMap<K, V> {

        private final Entry<K, V>[] entries;

        private static class Entry<K, V> {
            K k;
            V v;
            Entry<K, V> next;

            Entry(final K k, final V v) {
                this.k = k;
                this.v = v;
            }
        }

        BoundedMap(final int maxSize) {
            entries = new Entry[maxSize];
        }

        V put(final K k, final V v) {
            final int hashCode = k.hashCode();
            final int index = hashCode % entries.length;
            final Entry<K, V> entry = entries[index];
            if (entry == null) {
                entries[index] = new Entry<>(k, v);
            } else {
                //there may be nodes with unequal keys
                for (Entry<K, V> e = entry; e != null; e = e.next) {
                    if (e.k.equals(k)) {
                        final V old = e.v;
                        e.v = v;
                        return old;
                    }
                }
                //it's new
                final Entry<K, V> newEntry = new Entry<>(k, v);
                newEntry.next = entry;
                entries[index] = newEntry;
            }
            return null;
        }

        private Entry<K, V> getEntry(final K k) {
            final int hashCode = k.hashCode();
            final int index = hashCode % entries.length;
            final Entry<K, V> entry = entries[index];
            if (entry != null) {
                //there may be nodes with unequal keys
                for (Entry<K, V> e = entry; e != null; e = e.next) {
                    if (e.k.equals(k)) {
                        return e;
                    }
                }
            }
            return null;
        }

        V get(final K k) {
            final Entry<K, V> e = getEntry(k);
            return e == null ? null : e.v;
        }

    }

    static class ObjectPool<T> {

        private final int maxSize;
        private final Object noLongerFullNotifier = new Object();
        private final Object noLongerEmptyNotifier = new Object();
        private final Queue<T> queue;

        ObjectPool(final int maxSize) {
            this.maxSize = maxSize;
            this.queue = new ArrayDeque<>();
        }

        void put(final T obj) throws Exception {
            synchronized (noLongerFullNotifier) {
                while (queue.size() >= maxSize) {
                    noLongerFullNotifier.wait();
                }
            }
            synchronized (noLongerEmptyNotifier) {
                queue.add(obj);
                noLongerEmptyNotifier.notifyAll();
            }
        }

        T take() throws Exception {
            synchronized (noLongerEmptyNotifier) {
                while (queue.isEmpty()) {
                    noLongerEmptyNotifier.wait();
                }
            }
            synchronized (noLongerFullNotifier) {
                final T obj = queue.remove();
                noLongerFullNotifier.notifyAll();
                return obj;
            }
        }
    }

    static class OnesAndZeros {
        static int numOf(final String str, final int k) {
            int count = 0;
            for (int i = 0; i < str.length(); ++i) {
                if (k == Integer.parseInt("" + str.charAt(i))) {
                    count++;
                }
            }
            return count;
        }

        static class Cache {
            int z, o, count;
            Cache(final int z, final int o, final int count) {
                this.z = z;
                this.o = o;
                this.count = count;
            }
        }

        static int maxUpTo(final String[] all, final int iMax, final int m, final int n, final Map<Integer, Cache> memo) {
//            final int totalZeros = 0;
//            final int totalOnes = 0;
//            final int count = 0;
//            for (int i = iMax; i >= 0; i--) {
//                final Cache cached = memo.get(i);
//                if (cached != null && cached.z + totalZeros <= m && cached.o + totalOnes <= n) {
//                    count += cached.count;
//                    totalZeros += cached.z;
//                    totalOnes += cached.o;
//                    break;
//                }
//                final int zeros = numOf(all[i], 0);
//                final int ones = numOf(all[i], 1);
//                if (zeros + totalZeros <= m && ones + totalOnes <= n) {
//                    totalZeros += zeros;
//                    totalOnes += ones;
//                    count++;
//                }
//            }
//            memo.put(iMax, new Cache(totalZeros, totalOnes, count));
//            return count;
        }

        static int findMaxForm0(final String[] all, final int m, final int n) {
            final Map<Integer, Cache> memo = new HashMap<>();
            int maxSize = 0;
            for (int i = 0; i < all.length; i++) {
                final int count = maxUpTo(all, i, m, n, memo);
                if (count > maxSize) {
                    maxSize = count;
                }
            }
            return maxSize;
        }
        static int printMax(final Map<Integer, Cache> memo) {
            return memo.values().stream().map(p -> p.count).max(Integer::compareTo).get();
        }

        public int findMaxForm(final String[] strs, final int m, final int n) {
            return findMaxForm0(strs, m, n);
        }
    }

    static void assertEquals(final Object expected, final Object actual) {
        if (expected == null) {
            if (actual == null) {
                return;
            }
        } else {
            if (expected.equals(actual)) {
                return;
            }
        }
        throw new RuntimeException("Expected: " + expected + ", actual: " + actual);
    }

    public static void main(final String[] args) throws Exception {
        //System.out.println(new StrongPasswordChecker().strongPasswordChecker("1337C0d322111111111111"));
        //System.out.println(new MyAtoi().myAtoi("-91283472332"));
        //System.out.println(new MaxPointsOnLine().maxPoints(new int[][]{{1, 1}, {2, 2}, {3, 3}}));
        //System.out.println(Arrays.toString(new RemoveDigits().removeKDigits(new int[]{0, 9, 0, 1, 0, 0, 9}, 3)));
        //System.out.println(new SmallestSumSubArray().shortestSubarray(new int[]{1, 4, 45, 6, 0, 19}, 51));
//        MatrixRotator.matrixRotation(MatrixRotator.convert(new int[][]{
//                {1, 2, -2, 0},
//                {4, 5, -5, 10},
//                {7, 8, -7, 11},
//                {-1, -3, -4, 12}
//        }), 150);
//        MatrixRotator.matrixRotation(MatrixRotator.readInput(), 212131);
//        System.out.println(new Assessment().solution(new int[]{-1, 2, 3, 1, -4, 0, 2, 2, 6}));
//        System.out.println(new SuperReducedString().superReducedString("aaabccddd"));
//        System.out.println(Alternate.alternate("beabeefeab"));
//        final ObjectPool<Integer> pool = new ObjectPool<>(2);
//        ExecutorService es = Executors.newFixedThreadPool(2);
//        es.submit(() -> {
//            while (true) {
//                pool.put(1);
//            }
//        });
//        while (true) {
//            pool.take();
//        }
        assertEquals(2, new OnesAndZeros().findMaxForm(new String[]{"10", "0", "1"}, 1, 1));
        assertEquals(3, new OnesAndZeros().findMaxForm(new String[]{"10", "0001", "111001", "1", "0"}, 4, 3));
        assertEquals(3, new OnesAndZeros().findMaxForm(new String[]{"0001", "0101", "1000", "1000"}, 9, 3));
        assertEquals(17, new OnesAndZeros().findMaxForm(new String[]{"0","11","1000","01","0","101","1","1","1","0","0","0","0","1","0","0110101","0","11","01","00","01111","0011","1","1000","0","11101","1","0","10","0111"}, 9, 80));
    }
}
