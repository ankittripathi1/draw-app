'use client'
import * as React from "react"
import Image from "next/image"
import Link from 'next/link'
import { Button } from "./ui"
import { Navbar } from "./Navbar"


export const HeroSection = () => {
    
    return (
        <div>
            <Navbar />
            <main>
                <section className="overflow-hidden bg-white dark:bg-transparent">
                    <div className="relative mx-auto max-w-5xl px-6 py-28 lg:py-24">
                        <div className="relative z-10 mx-auto max-w-2xl text-center">
                            <h1 className="text-balance text-3xl font-semibold md:text-4xl lg:text-5xl">
                                Collaborative Whiteboarding
                            </h1>
                            <p className="mx-auto my-8 max-w-2xl text-xl text-muted-foreground">
                                Create, collaborate, and share beautiful diagrams and sketches
                                with our intuitive drawing tool. No sign-up required.
                            </p>

                            <Button
                                asChild
                                size="lg"
                                className="shadow-lg shadow-primary/35 dark:text-white ">
                                <Link href="#">
                                    <span className="btn-label">Start Building</span>
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="mx-auto -mt-16 max-w-7xl [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]">
                        <div className="[perspective:1200px] [mask-image:linear-gradient(to_right,black_50%,transparent_100%)] -mr-16 pl-16 lg:-mr-56 lg:pl-56">
                            <div className="[transform:rotateX(20deg);]">
                                <div className="lg:h-[44rem] relative skew-x-[.36rad]">
                                    <Image
                                        className="rounded-[--radius] z-[2] relative border dark:hidden"
                                        src="https://tailark.com/_next/image?url=%2Fcard.png&w=3840&q=75"
                                        alt="Tailark hero section"
                                        width={2880}
                                        height={2074}
                                    />
                                    <Image
                                        className="rounded-[--radius] z-[2] relative hidden border dark:block"
                                        src="https://tailark.com/_next/image?url=%2Fdark-card.webp&w=3840&q=75"
                                        alt="Tailark hero section"
                                        width={2880}
                                        height={2074}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

